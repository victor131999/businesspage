export function useDiscountsTranslations() {
  return {
    preview: {
      back: "Back",
      continue: "Continue",
      perMonth: "/month",
      planSelection: { title: "Select Plan", subtitle: "Choose a plan" },
      plans: {
        free: { title: "Free", features: ["Feature 1", "Feature 2"] },
        premium: { title: "Premium", features: ["Feature 1", "Feature 2"] },
      },
      basicInfo: {
        title: "Basic Info",
        subtitle: "Enter details",
        businessNameLabel: "Business Name",
        businessNamePlaceholder: "Name",
        businessIdLabel: "Business ID",
        businessIdPlaceholder: "ID",
      },
      map: {
        heroAlt: "Map",
        businessAddress: "Business Address",
      },
      addressDetails: {
        title: "Address Details",
        phoneLabel: "Phone",
        buildingLabel: "Building",
        buildingPlaceholder: "Building A",
        floorLabel: "Floor",
        floorPlaceholder: "1",
        referenceLabel: "Reference",
        referencePlaceholder: "Near park",
      },
      description: {
        title: "Description",
        prompt: "Describe your business",
        label: "Description",
        placeholder: "Enter description",
      },
      categoryDetection: {
        detected: "Detected",
        category: "Category",
        noTryAgain: "No, try again",
        yesContinue: "Yes, continue",
      },
      createPromo: {
        title: "Create Promo",
        subtitle: "New promotion",
        fields: {
          productName: "Product Name",
          price: "Price",
          clientProfile: "Client Profile",
        },
      },
    },
  };
}
