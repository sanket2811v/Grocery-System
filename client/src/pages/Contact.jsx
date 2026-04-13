import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Contact = () => {
  const { axios } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const { data } = await axios.post("/api/contact", form);

      if (data.success) {
        toast.success(data.message || "Message sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to send message"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pb-16 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">Contact Us</h1>

      <p className="text-gray-500 mb-6">
        Have a question or feedback? Send us a message and we&apos;ll get back
        to you.
      </p>

      <form onSubmit={onSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="w-full px-3 py-2.5 border border-gray-300 rounded outline-none focus:border-primary"
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="w-full px-3 py-2.5 border border-gray-300 rounded outline-none focus:border-primary"
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <input
          className="w-full px-3 py-2.5 border border-gray-300 rounded outline-none focus:border-primary"
          type="text"
          name="subject"
          placeholder="Subject (optional)"
          value={form.subject}
          onChange={handleChange}
        />

        <textarea
          className="w-full px-3 py-2.5 border border-gray-300 rounded outline-none focus:border-primary resize-none"
          rows={5}
          name="message"
          placeholder="Your message"
          value={form.message}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;