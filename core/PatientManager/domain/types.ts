export type CreatePatientProps = {
   name: string;
   gender: "M" | "F" | "O";
   contact: { email: string; tel: string };
   address: {
      street?: string;
      city?: string;
      postalCode?: string;
      country: string;
   };
   birthday: string;
   occupation?: string;
   images: string[];
};
