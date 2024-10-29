import BuildingForm from "@/components/BuildingForm";

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">建築物情報登録</h1>
      <BuildingForm />
    </div>
  );
}
