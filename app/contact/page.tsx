import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: 'Contact Us - Naijafame',
  description: 'Get in touch with us.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
          <div className="bg-bn-black text-white p-8 md:w-1/3">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <p className="mb-6 text-gray-300">
              Have questions or suggestions? We'd love to hear from you.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-bn-red">Email</h3>
                <p>contact@naijafame.com</p>
              </div>
              <div>
                <h3 className="font-bold text-bn-red">Address</h3>
                <p>Lagos, Nigeria</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 md:w-2/3">
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
}
