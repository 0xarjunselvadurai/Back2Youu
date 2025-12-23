import Navbar from '../components/Navbar';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Terms &amp; Conditions</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            This is a sample terms &amp; conditions page for Back2You. Replace this content with your
            real legal terms when they are ready.
          </p>
          <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p>
              By using the Back2You website and services, you agree that this platform is provided
              on an &quot;as is&quot; basis and may be updated or changed at any time.
            </p>
            <p>
              You are responsible for keeping your account details secure and for all activity that
              occurs under your account. Please use strong passwords and do not share your login
              credentials with others.
            </p>
            <p>
              For a full and legally binding set of terms, please consult your legal team and
              replace this sample text with your official documentation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
