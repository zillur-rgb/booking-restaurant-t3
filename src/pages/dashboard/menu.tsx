import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MultiValue } from "react-select/dist/declarations/src";
import { selectOptions } from "~/utils/helpers";
interface MenuProps {
  name: string;
  price: number;
  categories: MultiValue<{ value: string; label: string }>;
  file: undefined | File;
}

// When we import Select from react-select we will get a hydration error in Nextjs
// I found this solution to get rid of hydration error
// As I am using Nextjs 12, I can use a component client side like this
const DynamicSelect = dynamic(() => import("react-select"), { ssr: false });
const menu = () => {
  const [input, setInput] = useState<MenuProps>({
    name: "",
    price: 0,
    categories: [],
    file: undefined,
  });

  // Selecting the preview image URL
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    // create the preview
    if (!input.file) return;
    const objectUrl = URL.createObjectURL(input.file);
    setPreview(objectUrl);

    // Clean up the preview
    return () => URL.revokeObjectURL(objectUrl);
  }, [input.file]);
  return (
    <>
      <div>
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <input
            name="name"
            className="h-12 rounded-sm border-none bg-gray-200"
            type="text"
            placeholder="name"
            onChange={({ target }) =>
              setInput((prev) => ({ ...prev, name: target.value }))
            }
            value={input.name}
          />
          <input
            name="price"
            className="h-12 rounded-sm border-none bg-gray-200"
            type="number"
            placeholder="price"
            onChange={({ target }) =>
              setInput((prev) => ({ ...prev, price: Number(target.value) }))
            }
            value={input.price}
          />
          {/* Selection of the menu  */}
          <DynamicSelect
            value={input.categories}
            onChange={(e: any) =>
              setInput((prev) => ({ ...prev, categories: e }))
            }
            isMulti
            className="h-12"
            options={selectOptions}
          />

          <label
            htmlFor="file"
            className="relative h-12 cursor-pointer rounded-sm bg-gray-200 font-medium text-indigo-600 focus-within:outline-none"
          >
            <span className="sr-only">File input</span>
            <div className="flex h-full items-center justify-center">
              {preview ? (
                <div className="relative h-3/4 w-full">
                  <Image
                    alt="preview"
                    style={{ objectFit: "contain" }}
                    fill
                    src={preview}
                  />
                </div>
              ) : (
                <span>Select image</span>
              )}
            </div>
          </label>
        </div>
      </div>
    </>
  );
};

export default menu;
