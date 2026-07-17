import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { StarRating } from "./StarRating";
import { useAddReview, useUpdateReview } from "../../../hooks/useReviews";
import { useCurrentUser } from "../../providers/CurrentUserContext";
import { Review } from "../../../types";

const reviewSchema = z.object({
  rating: z
    .number({ invalid_type_error: "Please select a star rating" })
    .min(1, "Please select a star rating")
    .max(5),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be 80 characters or fewer"),
  body: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(1000, "Reviews are limited to 1000 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: number;
  /** Pass an existing review to switch the form into edit mode. */
  existingReview?: Review;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReviewForm({ productId, existingReview, onSuccess, onCancel }: ReviewFormProps) {
  const currentUser = useCurrentUser();
  const addReview = useAddReview();
  const updateReview = useUpdateReview();
  const isEditing = !!existingReview;
  const isSubmitting = addReview.isLoading || updateReview.isLoading;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.Rating ?? 0,
      title: existingReview?.Title ?? "",
      body: existingReview?.Body ?? "",
    },
  });

  const bodyLength = watch("body")?.length ?? 0;

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      if (isEditing && existingReview) {
        await updateReview.mutateAsync({
          reviewId: existingReview.ID,
          productId,
          updates: { Rating: values.rating, Title: values.title, Body: values.body },
        });
        toast.success("Your review has been updated");
      } else {
        // Author identity is taken from the logged-in SharePoint user,
        // never from a form field — this prevents someone from submitting
        // a review that appears to come from another user.
        await addReview.mutateAsync({
          ProductId: productId,
          Rating: values.rating,
          Title: values.title,
          Body: values.body,
          Author: {
            name: currentUser.displayName,
            email: currentUser.email,
          },
          IsVerified: false,
        });
        toast.success("Thanks! Your review has been posted.");
      }
      onSuccess();
    } catch (err) {
      toast.error(
        isEditing
          ? "We couldn't update your review. Please try again."
          : "We couldn't post your review. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-1">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Your rating
        </label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <StarRating
              rating={field.value}
              size="lg"
              interactive
              onRate={field.onChange}
            />
          )}
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="review-title" className="block text-sm font-medium text-foreground mb-2">
          Review title
        </label>
        <input
          id="review-title"
          type="text"
          {...register("title")}
          placeholder="Summarize your experience"
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Body */}
      <div>
        <label htmlFor="review-body" className="block text-sm font-medium text-foreground mb-2">
          Your review
        </label>
        <textarea
          id="review-body"
          rows={5}
          {...register("body")}
          placeholder="What did you like or dislike? How did you use this product?"
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <div className="flex items-center justify-between mt-1">
          {errors.body ? (
            <p className="text-sm text-red-500">{errors.body.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">{bodyLength}/1000</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? "Save changes" : "Submit review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg font-medium text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
