
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Briefcase, DollarSign, Phone } from "lucide-react";
import { workerService } from "@/services/workerService";
import { toast } from "sonner";

interface AddWorkerDialogProps {
  siteId: string;
  onWorkerAdded?: () => void;
}

export function AddWorkerDialog({ siteId, onWorkerAdded }: AddWorkerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [wage, setWage] = useState("");
  const [wageType, setWageType] = useState("Day");
  const [phone, setPhone] = useState("");

  const generateWorkerId = () => {
    return `WKR${Math.floor(Math.random() * 100000)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    try {
      await workerService.createWorker({
        worker_id: generateWorkerId(),
        name,
        contact_number: phone || "",
        address: "",
        skills: [role].filter(Boolean),
        daily_wage: wageType === "Day" ? Number(wage) : 0,
        joining_date: new Date().toISOString().split("T")[0],
        site_id: siteId,
        status: "active"
      });
      toast.success("Worker added successfully");
      setIsOpen(false);
      onWorkerAdded?.();
      setName("");
      setRole("");
      setWage("");
      setWageType("Day");
      setPhone("");
    } catch (error) {
      toast.error("Failed to add worker");
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Worker
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded max-w-sm w-full shadow-lg space-y-3">
            <h3 className="text-lg font-bold mb-2">Add Worker</h3>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold mb-1">Name*</label>
                <input
                  required
                  className="w-full border p-2 rounded"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Worker name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center">
                  <Briefcase className="inline mr-1" /> Work Role
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g. Mason, Electrician"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center">
                  <DollarSign className="inline mr-1" /> Wage
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    className="w-1/2 border p-2 rounded"
                    value={wage}
                    onChange={e => setWage(e.target.value)}
                    placeholder="e.g. 800"
                  />
                  <select className="w-1/2 border p-2 rounded" value={wageType} onChange={e => setWageType(e.target.value)}>
                    <option value="Day">Per Day</option>
                    <option value="Hour">Per Hour</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center">
                  <Phone className="inline mr-1" /> Phone
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
