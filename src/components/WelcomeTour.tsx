
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { localStorageService } from "@/services/localStorage";

const steps = [
  {
    title: "Welcome to Upastithi",
    description: "Upastithi is a construction site management app designed to help you track workers, attendance, inventory, and finances. Let's get you started!"
  },
  {
    title: "Sites",
    description: "First, create construction sites where your workers will be assigned. Click on 'Sites' in the sidebar and use the 'Add New Site' button to create your first site."
  },
  {
    title: "Workers",
    description: "After creating a site, you can add workers for that site. Navigate to the site and use the 'Workers' tab to add and manage your workforce."
  },
  {
    title: "Attendance",
    description: "Track daily attendance for your workers. Use the 'Attendance' tab to mark workers present or absent and record their check-in/out times."
  },
  {
    title: "Reports",
    description: "Generate reports for attendance, payroll, and more. Use the 'Reports' section to download data for your records and analysis."
  },
  {
    title: "You're all set!",
    description: "You're ready to use Upastithi! If you need help at any time, look for the '?' icon in the app. Happy managing!"
  }
];

export function WelcomeTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  
  // Check if this is the first time the user is seeing the tour
  const hasTourBeenShown = localStorageService.get<boolean>(`tour_shown_${user?.id}`);
  
  if (hasTourBeenShown) {
    return null;
  }
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleClose = () => {
    // Mark the tour as shown for this user
    if (user) {
      localStorageService.set(`tour_shown_${user.id}`, true);
    }
    setIsOpen(false);
  };
  
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Skip
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? "Get Started" : "Next"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
