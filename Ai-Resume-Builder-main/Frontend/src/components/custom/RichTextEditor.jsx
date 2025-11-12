import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Sparkles, LoaderCircle } from "lucide-react";

const PROMPT = `Position title: {positionTitle}. Create a JSON object with:
- "position_title": The job title
- "experience": Array of 5-7 HTML bullet points (<li> tags) describing relevant experience, skills, and achievements for this position. Make it professional and ATS-friendly.`;

function RichTextEditor({ onRichTextEditorChange, index, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.experience[index]?.workSummary || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo?.experience[index]?.title) {
      toast("Please Add Position Title");
      return;
    }
    
    setLoading(true);
    const prompt = PROMPT.replace(
      "{positionTitle}",
      resumeInfo.experience[index].title
    );

    try {
      const response = await fetch(
        "http://localhost:5000/api/resumes/generateSummary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ text: prompt }),
        }
      );

      const data = await response.json();

      if (data.success && data.data?.summary) {
        // Clean the response
        const cleaned = data.data.summary
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const resp = JSON.parse(cleaned);
        console.log("AI Response:", resp);

        // Join experience bullets into HTML
        const experienceHTML = resp.experience
          ? resp.experience.join("")
          : resp.experience_bullets?.join("") || "";

        setValue(experienceHTML);
        toast("Work Summary Generated Successfully!", { type: "success" });
      } else {
        toast("Failed to generate summary", { type: "error" });
        console.error("AI Response Error:", data);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast("Error generating summary", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          type="button"
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin h-4 w-4" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e.target.value);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;