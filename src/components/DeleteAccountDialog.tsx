import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CONFIRM_PHRASE = "DELETE";

const DeleteAccountDialog = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm.trim().toUpperCase() !== CONFIRM_PHRASE) {
      toast.error(`Please type ${CONFIRM_PHRASE} to confirm.`);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("account-delete", {
        body: { action: "request", reason: reason.trim() || null },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);

      toast.success("Your account has been deactivated. A confirmation email is on the way.");
      await supabase.auth.signOut();
      setOpen(false);
      navigate("/", { replace: true });
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive">
          <ShieldAlert className="h-4 w-4" />
          Delete account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your StayInKo account</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>This action follows our standard deletion policy:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Your profile is hidden from all users immediately.</li>
                <li>Your listings are archived and removed from search.</li>
                <li>Bookings remain visible to the other party for legal records.</li>
                <li>You have <strong>30 days</strong> to cancel by logging back in.</li>
                <li>After 30 days, your personal data is permanently deleted.</li>
                <li>We keep a minimal anonymized record for legal compliance.</li>
              </ul>
              <p>A confirmation email will be sent to your registered address.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Help us improve — what went wrong?"
              maxLength={500}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Type <span className="font-mono font-semibold text-destructive">DELETE</span> to confirm</Label>
            <Input
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Keep my account</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading || confirm.trim().toUpperCase() !== CONFIRM_PHRASE}
            onClick={(e) => { e.preventDefault(); handleDelete(); }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Permanently delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;