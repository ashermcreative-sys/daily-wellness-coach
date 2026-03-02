import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Supplement, useSupplements } from "@/hooks/useSupplements";
import { Plus, Trash2, Pill } from "lucide-react";
import { toast } from "sonner";

interface SupplementTrackerProps {
  userId: string | undefined;
}

export const SupplementTracker = ({ userId }: SupplementTrackerProps) => {
  const {
    supplements,
    loading,
    addSupplement,
    removeSupplement,
    toggleTaken,
    isSupplementTaken,
  } = useSupplements(userId);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newTime, setNewTime] = useState("morning");

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a supplement name");
      return;
    }
    try {
      await addSupplement(newName.trim(), newDosage.trim(), newTime);
      toast.success("Supplement added!");
      setNewName("");
      setNewDosage("");
      setNewTime("morning");
      setShowAdd(false);
    } catch {
      toast.error("Failed to add supplement");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeSupplement(id);
      toast.success("Supplement removed");
    } catch {
      toast.error("Failed to remove supplement");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTaken(id);
    } catch {
      toast.error("Failed to update");
    }
  };

  const groupByTime = (time: string) =>
    supplements.filter((s) => s.time_of_day === time);

  const timeSlots = [
    { key: "morning", label: "Morning", emoji: "🌅" },
    { key: "midday", label: "Midday", emoji: "☀️" },
    { key: "night", label: "Night", emoji: "🌙" },
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              Supplements & Vitamins
            </CardTitle>
            <CardDescription>Track your daily supplements checklist</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdd(!showAdd)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add form */}
        {showAdd && (
          <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
            <div className="space-y-2">
              <Label>Supplement Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Vitamin D3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Dosage (optional)</Label>
                <Input
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  placeholder="e.g. 2000 IU"
                />
              </div>
              <div className="space-y-2">
                <Label>Time of Day</Label>
                <Select value={newTime} onValueChange={setNewTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="midday">Midday</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} size="sm">
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Checklist by time of day */}
        {supplements.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No supplements added yet. Click "Add" to get started.
          </p>
        ) : (
          timeSlots.map(({ key, label, emoji }) => {
            const items = groupByTime(key);
            if (items.length === 0) return null;
            return (
              <div key={key} className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                  <span>{emoji}</span> {label}
                </h4>
                <div className="space-y-1">
                  {items.map((supp) => (
                    <SupplementItem
                      key={supp.id}
                      supplement={supp}
                      taken={isSupplementTaken(supp.id)}
                      onToggle={() => handleToggle(supp.id)}
                      onRemove={() => handleRemove(supp.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

const SupplementItem = ({
  supplement,
  taken,
  onToggle,
  onRemove,
}: {
  supplement: Supplement;
  taken: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) => (
  <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors group">
    <div className="flex items-center gap-3">
      <Checkbox
        checked={taken}
        onCheckedChange={onToggle}
      />
      <div>
        <span className={`text-sm font-medium ${taken ? "line-through text-muted-foreground" : ""}`}>
          {supplement.name}
        </span>
        {supplement.dosage && (
          <span className="text-xs text-muted-foreground ml-2">
            {supplement.dosage}
          </span>
        )}
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
      onClick={onRemove}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  </div>
);
