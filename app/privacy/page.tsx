import Navbar from '../components/Navbar';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            This is a sample privacy policy page for Back2You. Replace this content with your real
            policy text when it is ready.
          </p>
          <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p>
              We respect your privacy and are committed to protecting your personal data. This page
              explains, in simple language, how we may collect, use, and safeguard information when
              you use our services.
            </p>
            <p>
              Any personal details you provide, such as your name, email address, and contact
              information, are used only to operate the Back2You service, notify you about your
              items, and improve the overall user experience.
            </p>
            <p>
              For a full and legally binding privacy policy, please consult your legal team and
              replace this sample text with your official documentation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
