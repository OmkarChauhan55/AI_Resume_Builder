import React, { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
// import { ResumeInfoContext } from '@/context/ResumeInfoContext'
// import GlobalApi from './../../../../service/GlobalApi'
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateResumeData } from "@/Services/GlobalApi";
import { updateThisResume } from "@/Services/resumeAPI";

function ThemeColor({ resumeInfo }) {
  const dispatch = useDispatch();
  const colors = [
  "#FF5733", // orange-red
  "#33FF57", // lime-green
  "#3357FF", // blue
  "#FF33A1", // pink
  "#A133FF", // violet
  "#33FFA1", // aqua-green
  "#FF7133", // orange
  "#71FF33", // yellow-green
  "#7133FF", // indigo
  "#FF3371", // rose
  "#33FF71", // light-green
  "#3371FF", // sky-blue
  "#A1FF33", // chartreuse
  "#33A1FF", // light-blue
  "#33FF5A", // mint-green
  "#5A33FF", // deep-purple
  "#FF335A", // bright-pink
  "#33FFF5", // cyan
  "#FFD433", // golden-yellow
  "#FF8C33", // amber-orange
  "#33FFCC", // turquoise
  "#FF33F6", // magenta
  "#9D33FF", // dark-violet
  "#33FF99", // neon-green
  "#FF3333", // pure red
  "#33B8FF", // azure
  "#FFB833", // golden-orange
  "#33FFDA", // teal-blue
  "#FF33C4", // hot pink
  "#6EFF33" , // lime
  "#000000ea"
];


  const [selectedColor, setSelectedColor] = useState();
  const { resume_id } = useParams();
  const onColorSelect = async (color) => {
    setSelectedColor(color);
    dispatch(
      addResumeData({
        ...resumeInfo,
        themeColor: color,
      })
    );
    const data = {
      data: {
        themeColor: color,
      },
    };
    await updateThisResume(resume_id, data)
      .then(() => {
        toast.success("Theme Color Updated");
      })
      .catch((error) => {
        toast.error("Error updating theme color");
      });
    // console.log(" COlor Data to be updated", data);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2" size="sm">
          {" "}
          <Palette /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer
             hover:border-black border
             ${selectedColor == item && "border border-black"}
             `}
              style={{
                background: item,
              }}
            ></div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
