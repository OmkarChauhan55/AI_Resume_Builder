import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: "",
  workSummary: "",
};

function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const [experienceList, setExperienceList] = React.useState(
    resumeInfo?.experience || []
  );
  const [loading, setLoading] = React.useState(false);
  const { resume_id } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
    } catch (error) {
      console.log("error in experience context update", error.message);
    }
  }, [experienceList]);

  const addExperience = () => {
    if (!experienceList) {
      setExperienceList([formFields]);
      return;
    }
    setExperienceList([...experienceList, formFields]);
  };

  const removeExperience = (index) => {
    const list = [...experienceList];
    const newList = list.filter((item, i) => i !== index);
    setExperienceList(newList);
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { name, value } = e.target;
    const list = [...experienceList];
    list[index] = {
      ...list[index],
      [name]: value,
    };
    setExperienceList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const list = [...experienceList];
    list[index] = {
      ...list[index],
      [name]: value,
    };
    setExperienceList(list);
  };

  // ✅ Summary.jsx jaisa exact same pattern
  const onSave = () => {
    if (!resume_id) {
      toast("Resume ID not found", { type: "error" });
      return;
    }

    setLoading(true);
    console.log("Started Updating Experience");
    console.log("Data being sent:", { data: { experience: experienceList } });

    const data = { data: { experience: experienceList } };

    updateThisResume(resume_id, data)
      .then(() => {
        console.log("✅ Experience Updated Successfully");
        toast("Resume Updated", { type: "success" });
        enanbledNext(true);
        enanbledPrev(true);
      })
      .catch((error) => {
        console.error("❌ Error updating experience:", error);
        toast("Error updating resume", { description: error.message });
      })
      .finally(() => {
        console.log("🏁 Loading set to false");
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Experience</h2>
        <p>Add Your Previous Job Experience</p>
        <div>
          {experienceList?.map((experience, index) => (
            <div key={index}>
              <div className="flex justify-between my-2">
                <h3 className="font-bold text-lg">Experience {index + 1}</h3>
                <Button
                  variant="outline"
                  className="text-red-500"
                  onClick={() => removeExperience(index)}
                  type="button"
                >
                  <Trash2 />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label className="text-xs">Position Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={experience?.title || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <label className="text-xs">Company Name</label>
                  <Input
                    type="text"
                    name="companyName"
                    value={experience?.companyName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <label className="text-xs">City</label>
                  <Input
                    type="text"
                    name="city"
                    value={experience?.city || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <label className="text-xs">State</label>
                  <Input
                    type="text"
                    name="state"
                    value={experience?.state || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <label className="text-xs">Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    value={experience?.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <label className="text-xs">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    value={experience?.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="col-span-2">
                  <RichTextEditor
                    index={index}
                    defaultValue={experience?.workSummary}
                    onRichTextEditorChange={(value) =>
                      handleRichTextEditor(value, "workSummary", index)
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
            onClick={addExperience}
            variant="outline"
            className="text-primary"
            type="button"
          >
            + Add {experienceList?.length > 0 ? "more" : null} Experience
          </Button>
          <Button onClick={onSave} disabled={loading} type="button">
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;