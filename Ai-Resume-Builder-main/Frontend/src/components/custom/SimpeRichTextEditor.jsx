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

const PROMPT = `Create a JSON object with the following fields:
"projectName": A string representing the project
"techStack": A string representing the project tech stack
"projectSummary": An array of strings, each representing a bullet point in html format describing relevant experience for the given project title and tech stack
projectName-"{projectName}"
techStack-"{techStack}"`;

function SimpeRichTextEditor({ index, onRichTextEditorChange, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.projects[index]?.projectSummary || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Add Project Name and Tech Stack to generate summary");
      return;
    }
    
    setLoading(true);

    const prompt = PROMPT.replace(
      "{projectName}",
      resumeInfo?.projects[index]?.projectName
    ).replace("{techStack}", resumeInfo?.projects[index]?.techStack);
    
    console.log("Prompt", prompt);

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
        console.log("Response", resp);
        
        setValue(resp.projectSummary?.join("") || "");
        toast("Project Summary Generated Successfully!", { type: "success" });
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

export default SimpeRichTextEditor;