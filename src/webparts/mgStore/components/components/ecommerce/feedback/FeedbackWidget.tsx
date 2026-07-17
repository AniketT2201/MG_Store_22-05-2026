import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "../ui/Modal";
import { StarRating } from "../reviews/StarRating";
import { useCurrentUser } from "../../providers/CurrentUserContext";
import { useSubmitFeedback } from "../../../hooks/useFeedback";
import { FeedbackCategory } from "../../../types";
import { getSP } from "../../../services/SharePointService";

const CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: "Bug", label: "Something's broken" },
  { value: "Suggestion", label: "I have a suggestion" },
  { value: "Compliment", label: "Just saying thanks" },
  { value: "Other", label: "Something else" },
];

const feedbackSchema = z.object({
  category: z.enum(["Bug", "Suggestion", "Compliment", "Other"]),
  message: z
    .string()
    .trim()
    .min(5, "Please add a few more details")
    .max(1000, "Feedback is limited to 1000 characters"),
  rating: z.number().min(0).max(5).optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackWidgetProps {
  variant?: "floating" | "inline";
}

/**
 * Global feedback entry point ("Feedback — must have"). Renders a small
 * floating button in the bottom-right corner on every page; opens a modal
 * with a category picker, optional 1-5 satisfaction rating, and a message
 * field. Submits to the SiteFeedback SharePoint list via FeedbackService.
 */
export function FeedbackWidget({ variant = "floating" }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useCurrentUser();
  const submitFeedback = useSubmitFeedback();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { category: "Suggestion", message: "", rating: 0 },
  });

  const close = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      const User = await getSP().web.ensureUser(currentUser.email);
      await submitFeedback.mutateAsync({
        Category: values.category,
        Message: values.message,
        Rating: values.rating && values.rating > 0 ? values.rating : undefined,
        Author: { name: currentUser.displayName, email: currentUser.email },
        PageUrl: window.location.href,
      });
      toast.success("Thanks for the feedback!");
      close();
    } catch {
      toast.error("We couldn't submit your feedback. Please try again.");
    }
  };

  return (
    <>
      {variant === "floating" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 bg-foreground text-background rounded-full shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Give feedback"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Feedback</span>
        </button>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-4 bg-card border border-border rounded-xl p-5">
          <div>
            <h4 className="font-semibold text-foreground">Have feedback about this product?</h4>
            <p className="text-sm text-muted-foreground mt-0.5">Tell us what you think — good or bad.</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Give Feedback
          </button>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={close} title="Share your feedback" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              What's this about?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.value}
                  className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors"
                >
                  <input
                    type="radio"
                    value={cat.value}
                    {...register("category")}
                    className="accent-current"
                  />
                  <span className="text-sm text-foreground">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              How's your experience so far? <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <StarRating rating={field.value || 0} interactive onRate={field.onChange} />
              )}
            />
          </div>

          <div>
            <label htmlFor="feedback-message" className="block text-sm font-medium text-foreground mb-2">
              Your message
            </label>
            <textarea
              id="feedback-message"
              rows={4}
              {...register("message")}
              placeholder="Tell us what's on your mind..."
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={submitFeedback.isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {submitFeedback.isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Send feedback
            </button>
            <button
              type="button"
              onClick={close}
              className="px-6 py-2.5 rounded-lg font-medium text-muted-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
