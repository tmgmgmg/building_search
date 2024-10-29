"use client";
import { useState } from "react";
import { createBuilding } from "@/lib/microcms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BuildingForm() {
  const [formData, setFormData] = useState({
    name: "",
    architect: "",
    address: "",
    completionYear: "",
    structure: "",
    usage: "",
    category: "",
    description: "",
    latitude: "",
    longitude: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 写真のデフォルト情報を設定
    const defaultPhoto = {
      url: "", // または適切なデフォルトURL
      height: 0,
      width: 0,
    };

    // ここでMicroCMSのAPIを呼び出して建築物を登録します
    // 写真のアップロードはMicroCMSの管理画面から行う必要があります
    try {
      let photoInfo = defaultPhoto;

      // 写真がアップロードされている場合の処理
      if (photo) {
        // 例：写真のサイズ情報を取得
        const img = new Image();
        const photoUrl = URL.createObjectURL(photo);

        // 画像の読み込みを待つ
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = photoUrl;
        });

        photoInfo = {
          url: photoUrl,
          height: img.height,
          width: img.width,
        };

        // Blobの解放
        URL.revokeObjectURL(photoUrl);
      }

      const newBuilding = await createBuilding({
        ...formData,
        completionYear: parseInt(formData.completionYear),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        category: {
          id: formData.category, // カテゴリーIDを設定
          name: formData.category, // カテゴリー名を設定
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          revisedAt: new Date().toISOString(),
        },
        photo: photoInfo, // 写真情報を追加
      });
      console.log("New building created:", newBuilding);
    } catch (error) {
      console.error("Error creating building:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="建築物名"
        onChange={handleChange}
        required
      />
      <Input
        name="architect"
        placeholder="建築家"
        onChange={handleChange}
        required
      />
      <Input
        name="address"
        placeholder="住所"
        onChange={handleChange}
        required
      />
      <Input
        name="completionYear"
        type="number"
        placeholder="竣工年"
        onChange={handleChange}
        required
      />
      <Input
        name="structure"
        placeholder="構造"
        onChange={handleChange}
        required
      />
      <Input name="usage" placeholder="用途" onChange={handleChange} required />
      <Select
        name="category"
        onValueChange={(value) => setFormData({ ...formData, category: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="カテゴリ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="museum">美術館</SelectItem>
          <SelectItem value="library">図書館</SelectItem>
          <SelectItem value="commercial">商業施設</SelectItem>
          <SelectItem value="other">その他</SelectItem>
        </SelectContent>
      </Select>
      <Textarea
        name="description"
        placeholder="説明"
        onChange={handleChange}
        required
      />
      <Input
        name="latitude"
        type="number"
        step="any"
        placeholder="緯度"
        onChange={handleChange}
        required
      />
      <Input
        name="longitude"
        type="number"
        step="any"
        placeholder="経度"
        onChange={handleChange}
        required
      />
      <Input type="file" accept="image/*" onChange={handlePhotoChange} />
      <Button type="submit">登録</Button>
    </form>
  );
}
