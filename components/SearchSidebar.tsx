import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Building } from "@/lib/microcms";

type SearchSidebarProps = {
  buildings: Building[];
  onBuildingClick: (building: Building) => void;
};

export default function SearchSidebar({
  buildings,
  onBuildingClick,
}: SearchSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredBuildings = buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" ||
        building.category.name === selectedCategory)
  );

  const categories = ["all", ...new Set(buildings.map((b) => b.category.name))];

  return (
    <aside className="w-64 bg-background border-r p-4 overflow-y-auto">
      <div className="space-y-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          建築物を検索
        </label>
        <Input
          id="search"
          type="search"
          placeholder="建築物を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          カテゴリ
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "すべて" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">検索結果</h2>
        <div className="space-y-4">
          {filteredBuildings.map((building) => (
            <Card key={building.id}>
              <CardHeader>
                <CardTitle>{building.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  建築家: {building.architect}
                </p>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => onBuildingClick(building)}
                >
                  <MapPin className="mr-2 h-4 w-4" /> 地図で見る
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </aside>
  );
}
