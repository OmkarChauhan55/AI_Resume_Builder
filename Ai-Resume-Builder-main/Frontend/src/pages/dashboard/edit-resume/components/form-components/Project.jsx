import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpeRichTextEditor from "@/components/custom/SimpeRichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  projectName: "",
  techStack: "",
  projectSummary: "",
};

function Project({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [projectList, setProjectList] = useState(resumeInfo?.projects || []);
  const [loading, setLoading] = useState(false);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, projects: projectList }));
  }, [projectList]);

  const addProject = () => {
    setProjectList([...projectList, formFields]);
  };

  const removeProject = (index) => {
    const list = [...projectList];
    const newList = list.filter((item, i) => i !== index);
    setProjectList(newList);
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    const { name, value } = e.target;
    const list = [...projectList];
    list[index] = {
      ...list[index],
      [name]: value,
    };
    setProjectList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    const list = [...projectList];
    list[index] = {
      ...list[index],
      [name]: value,
    };
    setProjectList(list);
  };

  const onSave = () => {
    if (!resume_id) {
      toast("Resume ID not found", { type: "error" });
      return;
    }

    setLoading(true);
    console.log("Started Updating Project");

    const data = {
      data: {
        projects: projectList,
      },
    };

    updateThisResume(resume_id, data)
      .then(() => {
        console.log("✅ Projects Updated Successfully");
        toast("Resume Updated", { type: "success" });
        setEnabledNext(true);
        setEnabledPrev(true);
      })
      .catch((error) => {
        console.error("❌ Error updating projects:", error);
        toast("Error updating resume", { description: error.message });
      })
      .finally(() => {
        console.log("🏁 Loading set to false");
        setLoading(false);
      });
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Projects</h2>
      <p>Add your projects</p>
      <div>
        {projectList?.map((project, index) => (
          <div key={index}>
            <div className="flex justify-between my-2">
              <h3 className="font-bold text-lg">Project {index + 1}</h3>
              <Button
                variant="outline"
                className="text-red-500"
                onClick={() => removeProject(index)}
                type="button"
              >
                <Trash2 />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div>
                <label className="text-xs">Project Name</label>
                <Input
                  type="text"
                  name="projectName"
                  value={project?.projectName || ""}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs">Tech Stack</label>
                <Input
                  type="text"
                  name="techStack"
                  value={project?.techStack || ""}
                  placeholder="React, Node.js, Express, MongoDB"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="col-span-2">
                <SimpeRichTextEditor
                  index={index}
                  defaultValue={project?.projectSummary}
                  onRichTextEditorChange={(value) =>
                    handleRichTextEditor(value, "projectSummary", index)
                  }
                  resumeInfo={resumeInfo}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-2">
        <Button 
          onClick={addProject} 
          variant="outline" 
          className="text-primary"
          type="button"
        >
          + Add {projectList?.length > 0 ? "more" : null} project
        </Button>
        <Button onClick={onSave} disabled={loading} type="button">
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Project;