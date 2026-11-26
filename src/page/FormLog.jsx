import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { keycloak } from "../keyCloak";

function FormLog() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        gateCode: "",
        laneCode: "",
        terminal: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await keycloak.updateToken(30);
            const res = await fetch("http://localhost:8080/api/camera/stream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${keycloak.token}`,
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                throw new Error(`Failed to fetch camera information (${res.status})`);
            }
            const data = await res.json();
            if (!Array.isArray(data)) {
                throw new Error("Camera information response must be an array");
            }
            localStorage.setItem("stream", JSON.stringify(data));
            navigate("/gate");
        } catch (submitError) {
            console.error("API Error:", submitError);
            setError(submitError.message || "Unable to connect to the cameras.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold text-gray-800">
                Gate Camera Configuration
            </h2>

            <p className="text-gray-500 mb-6">
                Select your gate, lane and terminal.
            </p>

            {error && (
                <p role="alert" className="mb-4 text-red-600">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Gate */}
                <div>
                    <label className="block mb-2 font-medium">
                        Gate
                    </label>

                    <select
                        name="gateCode"
                        value={formData.gateCode}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    >
                        <option value="">Select Gate</option>
                        <option value="Gate1">Gate 1</option>
                        <option value="Gate2">Gate 2</option>
                        <option value="Gate3">Gate 3</option>
                    </select>
                </div>

                {/* Lane */}
                <div>
                    <label className="block mb-2 font-medium">
                        Lane
                    </label>

                    <select
                        name="laneCode"
                        value={formData.laneCode}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    >
                        <option value="">Select Lane</option>
                        <option value="Lane01">Lane 01</option>
                        <option value="Lane02">Lane 02</option>
                        <option value="Lane03">Lane 03</option>
                        <option value="Lane04">Lane 04</option>
                    </select>
                </div>

                {/* Terminal */}
                <div>
                    <label className="block mb-2 font-medium">
                        Terminal
                    </label>

                    <select
                        name="terminal"
                        value={formData.terminal}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    >
                        <option value="">Select Terminal</option>
                        <option value="LM17">LM17</option>
                        <option value="LM18">LM18</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
                >
                    {isSubmitting ? "Connecting..." : "Connect Cameras"}
                </button>

            </form>

        </div>
    );
}

export default FormLog;