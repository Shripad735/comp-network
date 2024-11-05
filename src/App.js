import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import LineCodingVisualizer from './LineCodingVisualizer';
import TCPUDPTrafficAnalysis from './TCPUDPTrafficAnalysis';
import DNSHTTPProtocolVisualizer from './DNSHTTPProtocolVisualizer';
import PacketSwitchingSimulator from './PacketSwitchingSimulator';
import SubnetCalculator from './SubnetCalculator';
import SubnetMapper from './SubnetMapper';
import SubnetVulnerabilityScanner from './SubnetVulnerabilityScanner';


const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <div>
                  <Link to="/line-coding-visualizer" className="flex items-center py-4 px-2">
                    <span className="font-semibold text-gray-500 text-lg">Network Visualizer</span>
                  </Link>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                  <Link to="/line-coding-visualizer" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Line Coding</Link>
                  <Link to="/tcp-udp" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">TCP/UDP</Link>
                  <Link to="/dns-http" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">DNS/HTTP</Link>
                  {/* <Link to="/packet-switching-simulator" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Packet Switching Simulator</Link> */}
                  <Link to="/subnet-calculator" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Subnet Calculator</Link>
                  <Link to="/subnet-mapper" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Subnet Mapper</Link>
                  {/* <Link to="/subnet-vulnerability-scanner" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Subnet Vulnerability Scanner</Link> */}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-8">
          <Routes>
            <Route path="/comp-network" element={<LineCodingVisualizer />} />
            <Route path="/line-coding-visualizer" element={<LineCodingVisualizer />} />
            <Route path="/tcp-udp" element={<TCPUDPTrafficAnalysis />} />
            <Route path="/dns-http" element={<DNSHTTPProtocolVisualizer />} />
            {/* <Route path="/packet-switching-simulator" element={<PacketSwitchingSimulator />} /> */}
            <Route path="/subnet-calculator" element={<SubnetCalculator />} />
            <Route path="/subnet-mapper" element={<SubnetMapper />} />
            {/* <Route path="/subnet-vulnerability-scanner" element={<SubnetVulnerabilityScanner />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;