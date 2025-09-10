import { useState } from "react";
import Collapsible from "../components/Collapsible";
import { useNavigate } from "react-router-dom";
import { habitSchema } from "../schemas/schema";

const CreateHabit = () => {
  const [title, setTitle] = useState("");
  const [freq, setFreq] = useState("daily");
  const [category, setCategory] = useState("Other");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // console.log(title);
  const handleFreq1 = (e) => {
    setFreq(e);
    if (errors.frequency) {
      setErrors((prev) => ({ ...prev, frequency: undefined }));
    }
    // console.log(e);
  };
  const handleFreq2 = (e) => {
    // console.log(e);
    setCategory(e);
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };
  const onSubmit = async () => {
    setErrors({});
    setApiError("");

    const validationResult = habitSchema.safeParse({
      title: title,
      frequency: freq,
      category: category,
    });

    if (!validationResult.success) {
      const validationErrors = {};
      // console.log(validationResult.error.issues);
      if (validationResult.error.issues) {
        // console.log(validationResult.error.ZodError[0].path[0]);
        validationResult.error.issues.forEach((error) => {
          validationErrors[error.path[0]] = error.message;
        });
      }
      // else {
      //   validationResult.error.forEach((error) => {
      //     validationErrors[error.path[0]] = error.message;
      //   });
      // }
      // console.log(validationErrors);
      setErrors(validationErrors);
      return;
    }
    try {
      const data = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/habits/create`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: title, frequency: freq, category }),
        }
      );
      const res = await data.json();
      if (res.message) {
        navigate("/dashboard");
      }
      if (res.error) {
        setApiError(res.error);
      }
    } catch (err) {
      setApiError(err);
    }
  };
  return (
    <div className="text-white flex gap-4 h-full flex-col items-center justify-center">
      <div className="flex items-start flex-col gap-6">
        <div>
          <div className="p-2">Title</div>
          <input
            type="title"
            placeholder="Title"
            name="title"
            id="title"
            onChange={(e) => {
              setTitle(e.target.value);
              // Clear title error when user starts typing
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            className="bg-white w-fit py-1 px-2 rounded-xl hover:bg-slate-200 text-black"
          />
          {errors.title && (
            <div className="text-sm mt-1 text-red-500">{errors.title}</div>
          )}
        </div>
        <div>
          <Collapsible
            label={"Select Frequency:"}
            options={["daily", "weekly"]}
            defaultValue={"daily"}
            onChange={handleFreq1}
          />
          {errors.frequency && (
            <div className="text-sm mt-1 text-red-500">{errors.frequency}</div>
          )}
        </div>
        <div>
          <Collapsible
            label={"Select Category:"}
            options={[
              "Health",
              "Fitness",
              "Learning",
              "Productivity",
              "Mindfulness",
              "Social",
              "Other",
            ]}
            defaultValue={"Other"}
            onChange={handleFreq2}
          />
          {errors.category && (
            <div className="text-sm mt-1 text-red-500">{errors.category}</div>
          )}
        </div>
        <div className="flex items-center justify-center w-full">
          <button
            className="bg-green-500 px-4 py-1 font-bold rounded-lg hover:bg-green-600"
            onClick={onSubmit}
          >
            Create Habit
          </button>
        </div>
        <div>
          {apiError && (
            <div className="text-sm my-2 text-red-600">{apiError}</div>
          )}
        </div>
        {/* <form onSubmit={onSubmit}> */}
        {/* <label htmlFor="title" className="text-white"></label> */}
        {/* </form> */}
      </div>
    </div>
  );
};

export default CreateHabit;
