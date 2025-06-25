import React, { useState } from 'react';

export default function VendorOnboarding({ vendor, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const onboardingSteps = [
    {
      title: "Welcome to Bazro Marketplace!",
      description: `Congratulations ${vendor?.store_name}! Your vendor account has been successfully created.`,
      content: (
        <div className="onboarding-content">
          <div className="welcome-banner">
            <div className="welcome-icon">
              <i className="icon-shop" style={{ fontSize: '48px', color: '#22C55E' }}></i>
            </div>
            <h4 className="text-center mb-20">Your store is ready!</h4>
            <p className="text-center body-text">
              You can now start adding products, managing orders, and growing your business on our platform.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Getting Started",
      description: "Here's what you can do next to set up your store:",
      content: (
        <div className="onboarding-content">
          <div className="checklist">
            <div className="checklist-item">
              <i className="icon-check-circle" style={{ color: '#22C55E' }}></i>
              <div>
                <h6>Add Your First Product</h6>
                <p>Start by adding products to your store inventory</p>
              </div>
            </div>
            <div className="checklist-item">
              <i className="icon-user" style={{ color: '#2563eb' }}></i>
              <div>
                <h6>Complete Your Profile</h6>
                <p>Add a store logo and detailed description</p>
              </div>
            </div>
            <div className="checklist-item">
              <i className="icon-settings" style={{ color: '#f59e0b' }}></i>
              <div>
                <h6>Configure Store Settings</h6>
                <p>Set up payment and shipping preferences</p>
              </div>
            </div>
            <div className="checklist-item">
              <i className="icon-chart-bar" style={{ color: '#8b5cf6' }}></i>
              <div>
                <h6>Track Your Performance</h6>
                <p>Monitor sales and customer feedback</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Quick Tour",
      description: "Here are the key areas of your vendor dashboard:",
      content: (
        <div className="onboarding-content">
          <div className="tour-grid">
            <div className="tour-item">
              <div className="tour-icon">
                <i className="icon-box"></i>
              </div>
              <div className="tour-content">
                <h6>Products</h6>
                <p>Manage your product catalog, inventory, and pricing</p>
              </div>
            </div>
            <div className="tour-item">
              <div className="tour-icon">
                <i className="icon-shopping-cart"></i>
              </div>
              <div className="tour-content">
                <h6>Orders</h6>
                <p>View and manage customer orders and shipments</p>
              </div>
            </div>
            <div className="tour-item">
              <div className="tour-icon">
                <i className="icon-chart-line"></i>
              </div>
              <div className="tour-content">
                <h6>Analytics</h6>
                <p>Track sales performance and customer insights</p>
              </div>
            </div>
            <div className="tour-item">
              <div className="tour-icon">
                <i className="icon-credit-card"></i>
              </div>
              <div className="tour-content">
                <h6>Payouts</h6>
                <p>Manage your earnings and payment settings</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Ready to start selling on Bazro Marketplace",
      content: (
        <div className="onboarding-content">
          <div className="completion-banner">
            <div className="completion-icon">
              <i className="icon-check-circle" style={{ fontSize: '64px', color: '#22C55E' }}></i>
            </div>
            <h4 className="text-center mb-20">Welcome to the Bazro Community!</h4>
            <p className="text-center body-text mb-30">
              You now have access to all vendor features. Start by adding your first product or exploring the dashboard.
            </p>
            <div className="action-buttons">
              <button className="tf-button style-1 me-10" onClick={() => window.location.href = '/products/add'}>
                Add First Product
              </button>
              <button className="tf-button style-2" onClick={handleComplete}>
                Explore Dashboard
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    localStorage.setItem('vendor_onboarding_completed', 'true');
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (isCompleted) {
    return null; // Don't render anything if completed
  }

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            ></div>
          </div>
          <div className="step-indicator">
            Step {currentStep + 1} of {onboardingSteps.length}
          </div>
          <button className="close-btn" onClick={handleSkip}>
            <i className="icon-close"></i>
          </button>
        </div>

        <div className="onboarding-body">
          <h3 className="onboarding-title">{currentStepData.title}</h3>
          <p className="onboarding-description">{currentStepData.description}</p>
          <div className="onboarding-step-content">
            {currentStepData.content}
          </div>
        </div>

        <div className="onboarding-footer">
          <div className="footer-left">
            {currentStep > 0 && (
              <button className="tf-button style-2" onClick={handlePrevious}>
                Previous
              </button>
            )}
          </div>
          <div className="footer-center">
            <div className="step-dots">
              {onboardingSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                  onClick={() => setCurrentStep(index)}
                ></div>
              ))}
            </div>
          </div>
          <div className="footer-right">
            {currentStep < onboardingSteps.length - 1 ? (
              <button className="tf-button style-1" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button className="tf-button style-1" onClick={handleComplete}>
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
