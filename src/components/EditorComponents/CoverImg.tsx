import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import UnsplashImageSelector from "./UnsplashImageSelector";

const CoverImg = ({
  init,
  setCoverImage,
}: {
  init: string;
  setCoverImage: Function;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = init;
      setImage(init);
      setCoverImage(init);
    }
  }, [init, setCoverImage]);
  function setCover(url: string) {
    if (inputRef && inputRef.current) {
      inputRef.current.value = url;
      setImage(url);
      setCoverImage(url);
    }
  }
  return (
    <div className="lg:mr-10 lg:flex lg:items-center lg:justify-between">
      <div className="mx-auto flex w-[80%] max-w-prose items-center justify-center gap-2 lg:mx-32">
        <Input ref={inputRef} placeholder="url for cover image (optional)" />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="block">
              <ImageIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Cover Image from unsplash</DialogTitle>
              <DialogDescription>
                Only images from unsplash are allowed as of now
              </DialogDescription>
            </DialogHeader>
            <UnsplashImageSelector setCover={setCover} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mx-auto mt-10 w-fit">
        {image ? (
          <Image
            priority
            src={image}
            className="rounded-lg"
            alt="Selected Image"
            width={300}
            height={200}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CoverImg;
