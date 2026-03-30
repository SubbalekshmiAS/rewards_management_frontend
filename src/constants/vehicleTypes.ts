export const vehicleTypeOptions = [
  { value: 1, label: "Bike / Scooter" },
  { value: 2, label: "Auto (3 Wheeler)" },
  { value: 3, label: "Car / Jeep" },
  { value: 4, label: "Light Commercial (LCV)" },
  { value: 5, label: "Heavy Commercial (HCV)" },
];

export const vehicleTypeMap: Record<number, string> =
  Object.fromEntries(vehicleTypeOptions.map(v => [v.value, v.label]));