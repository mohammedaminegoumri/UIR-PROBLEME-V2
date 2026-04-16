import { Link } from 'react-router-dom';
import { MessageSquare, Heart, Users, MessageCircle, Shield, Eye } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Submit Problems',
      description: 'Share your academic, campus, or personal challenges anonymously. Get help from the community.',
      link: '/problems',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Heart,
      title: 'Crush Finder',
      description: 'Looking for someone special? Submit details and let the community help you connect.',
      link: '/crush-finder',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: Users,
      title: 'University Forum',
      description: 'Organized discussions by major, year, and topic. Connect with fellow students.',
      link: '/forum',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: MessageCircle,
      title: 'Anonymous Chat',
      description: 'Real-time anonymous conversations with pseudonyms. Discuss anything safely.',
      link: '/chat',
      color: 'bg-green-100 text-green-600'
    },
  ];

  const values = [
    {
      icon: Eye,
      title: 'Complete Anonymity',
      description: 'Your identity is protected. Share freely without fear of judgment.'
    },
    {
      icon: Shield,
      title: 'GDPR Compliant',
      description: 'We respect your privacy and handle data according to strict regulations.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by students, for students. Everyone helps everyone.'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-yellow-500">UIR</span>
              <span className="text-blue-600"> PROBLEMES</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Your Anonymous University Support Platform
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              From academic challenges to finding your campus crush, we're here to help every student navigate university life with complete anonymity and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/problems"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Submit a Problem
              </Link>
              <Link
                to="/forum"
                className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Browse Forum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group p-6 bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-200 text-center"
              >
                <div className="inline-flex w-16 h-16 rounded-full bg-blue-100 text-blue-600 items-center justify-center mb-4">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of UIR students who trust us with their concerns and connections.
          </p>
          <Link
            to="/problems"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Help Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
