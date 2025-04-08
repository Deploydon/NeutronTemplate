export default function HelpPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-6 bg-gray-900 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Help</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6 flex flex-col items-center">
        <a 
          href="http://github.com/Deploydon/NeutronTemplate" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg mb-6"
        >
          GitHub Repository
        </a>
        
        <a 
          href="https://t.me/neutron_community" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
        >
          Neutron Community Telegram
        </a>
      </div>
    </div>
  );
}
