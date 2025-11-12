import React from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { LoaderCircle, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

function PersonalDetails({ resumeInfo, enanbledNext }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [photoPreview, setPhotoPreview] = React.useState(resumeInfo?.photo || null);
  const [formData, setFormData] = React.useState({
    firstName: resumeInfo?.firstName || "",
    lastName: resumeInfo?.lastName || "",
    jobTitle: resumeInfo?.jobTitle || "",
    address: resumeInfo?.address || "",
    phone: resumeInfo?.phone || "",
    email: resumeInfo?.email || "",
    photo: resumeInfo?.photo || null,
  });

  const handleInputChange = (e) => {
    enanbledNext(false);
    const { name, value } = e.target;
    
    dispatch(
      addResumeData({
        ...resumeInfo,
        [name]: value,
      })
    );
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast("File size should be less than 2MB", { type: "error" });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast("Please select an image file", { type: "error" });
        return;
      }

      enanbledNext(false);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPhotoPreview(base64String);
        
        dispatch(
          addResumeData({
            ...resumeInfo,
            photo: base64String,
          })
        );
        
        setFormData({
          ...formData,
          photo: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    enanbledNext(false);
    setPhotoPreview(null);
    
    dispatch(
      addResumeData({
        ...resumeInfo,
        photo: null,
      })
    );
    
    setFormData({
      ...formData,
      photo: null,
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    
    if (!resume_id) {
      toast("Resume ID not found", { type: "error" });
      return;
    }

    setLoading(true);
    console.log("Personal Details Save Started");
    
    const data = {
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        jobTitle: formData.jobTitle,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        photo: formData.photo,
      },
    };

    try {
      await updateThisResume(resume_id, data);
      toast("Resume Updated", { type: "success" });
      enanbledNext(true);
    } catch (error) {
      toast("Error updating resume", { description: error.message });
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get Started with the basic information</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">First Name</label>
            <Input
              name="firstName"
              value={formData.firstName}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Last Name</label>
            <Input
              name="lastName"
              value={formData.lastName}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Job Title</label>
            <Input
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Address</label>
            <Input
              name="address"
              value={formData.address}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              name="email"
              value={formData.email}
              required
              onChange={handleInputChange}
            />
          </div>

          {/* Photo Upload Section */}
          <div className="col-span-2">
            <label className="text-sm">Profile Photo (Optional - for some templates)</label>
            
            {!photoPreview ? (
              <div className="mt-2">
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload photo</span>
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG (MAX. 2MB)</p>
                  </div>
                  <Input
                    id="photo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            ) : (
              <div className="mt-2 relative inline-block">
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-0"
                  onClick={removePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;