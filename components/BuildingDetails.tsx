import { Building } from "@/lib/microcms";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

type BuildingDetailsProps = {
  building: Building;
  onClose: () => void;
};

export default function BuildingDetails({
  building,
  onClose,
}: BuildingDetailsProps) {
  return (
    <div className="w-80 bg-background border-l p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{building.name}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">閉じる</span>
        </Button>
      </div>
      {building.photo && (
        <div className="mb-4">
          <Image
            src={building.photo.url}
            alt={building.name}
            width={building.photo.width}
            height={building.photo.height}
            layout="responsive"
          />
        </div>
      )}
      <div className="space-y-4">
        <p>
          <strong>建築家:</strong> {building.architect}
        </p>
        <p>
          <strong>住所:</strong> {building.address}
        </p>
        <p>
          <strong>竣工年:</strong> {building.completionYear}
        </p>
        <p>
          <strong>構造:</strong> {building.structure}
        </p>
        <p>
          <strong>用途:</strong> {building.usage}
        </p>
        <p>
          <strong>カテゴリ:</strong> {building.category.name}
        </p>
        <p>
          <strong>説明:</strong>
        </p>
        <div dangerouslySetInnerHTML={{ __html: building.description }} />
      </div>
    </div>
  );
}
