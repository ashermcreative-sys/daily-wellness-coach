import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CheckInFormProps {
  timeSlot: "morning" | "midday" | "night";
  existingEntry?: any;
  onSubmit: (data: any) => Promise<void>;
  disabled?: boolean;
}

export const CheckInForm = ({ timeSlot, existingEntry, onSubmit, disabled }: CheckInFormProps) => {
  const [formData, setFormData] = useState({
    mood_score: existingEntry?.mood_score || 5,
    stress_score: existingEntry?.stress_score || 5,
    energy_score: existingEntry?.energy_score || 5,
    pain_score: existingEntry?.pain_score || 0,
    slept_well: existingEntry?.slept_well || "neutral",
    exercise_level: existingEntry?.exercise_level || "none",
    caffeine: existingEntry?.caffeine || "none",
    alcohol: existingEntry?.alcohol || "none",
    notes: existingEntry?.notes || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      toast.success(`${timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)} check-in saved!`);
    } catch (error) {
      toast.error("Failed to save check-in");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeSlotEmoji = () => {
    if (timeSlot === "morning") return "🌅";
    if (timeSlot === "midday") return "☀️";
    return "🌙";
  };

  const getTimeSlotDescription = () => {
    if (timeSlot === "morning") return "How did you wake up?";
    if (timeSlot === "midday") return "How's your day going?";
    return "How are you ending the day?";
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{getTimeSlotEmoji()}</span>
          {timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)} Check-in
        </CardTitle>
        <CardDescription>{getTimeSlotDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mood (0-10)</Label>
              <Slider
                value={[formData.mood_score]}
                onValueChange={(val) => setFormData({ ...formData, mood_score: val[0] })}
                max={10}
                step={0.5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-right">{formData.mood_score}</p>
            </div>

            <div className="space-y-2">
              <Label>Stress (0-10)</Label>
              <Slider
                value={[formData.stress_score]}
                onValueChange={(val) => setFormData({ ...formData, stress_score: val[0] })}
                max={10}
                step={0.5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-right">{formData.stress_score}</p>
            </div>

            <div className="space-y-2">
              <Label>Energy (0-10)</Label>
              <Slider
                value={[formData.energy_score]}
                onValueChange={(val) => setFormData({ ...formData, energy_score: val[0] })}
                max={10}
                step={0.5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-right">{formData.energy_score}</p>
            </div>

            <div className="space-y-2">
              <Label>Pain/Discomfort (0-10)</Label>
              <Slider
                value={[formData.pain_score]}
                onValueChange={(val) => setFormData({ ...formData, pain_score: val[0] })}
                max={10}
                step={0.5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-right">{formData.pain_score}</p>
            </div>
          </div>

          {timeSlot === "morning" && (
            <div className="space-y-2">
              <Label>Slept Well?</Label>
              <Select 
                value={formData.slept_well} 
                onValueChange={(val) => setFormData({ ...formData, slept_well: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exercise Level</Label>
              <Select 
                value={formData.exercise_level} 
                onValueChange={(val) => setFormData({ ...formData, exercise_level: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="intense">Intense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Caffeine</Label>
              <Select 
                value={formData.caffeine} 
                onValueChange={(val) => setFormData({ ...formData, caffeine: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Alcohol</Label>
            <Select 
              value={formData.alcohol} 
              onValueChange={(val) => setFormData({ ...formData, alcohol: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="some">Some</SelectItem>
                <SelectItem value="more">More</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="How are you feeling? Any thoughts or observations..."
              className="min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || disabled}
          >
            {isSubmitting ? "Saving..." : existingEntry ? "Update Check-in" : "Save Check-in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};