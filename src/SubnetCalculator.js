import React, { useState } from 'react';
import { Calculator, RefreshCw, Check } from 'lucide-react';

const SubnetCalculator = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [cidr, setCidr] = useState('24');
  const [calculationResult, setCalculationResult] = useState(null);
  const [error, setError] = useState('');

  const isValidIP = (ip) => {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) return false;
    
    const octets = ip.split('.');
    return octets.every(octet => parseInt(octet) >= 0 && parseInt(octet) <= 255);
  };

  const calculateSubnet = () => {
    if (!isValidIP(ipAddress)) {
      setError('Please enter a valid IP address');
      setCalculationResult(null);
      return;
    }

    const cidrNum = parseInt(cidr);
    if (cidrNum < 0 || cidrNum > 32) {
      setError('CIDR must be between 0 and 32');
      setCalculationResult(null);
      return;
    }

    setError('');

    // Calculate subnet details
    const ipOctets = ipAddress.split('.').map(Number);
    const totalHosts = Math.pow(2, 32 - cidrNum);
    const usableHosts = Math.max(totalHosts - 2, 0);

    // Calculate subnet mask
    const fullMask = cidrNum === 32 ? 0xffffffff : ~((1 << (32 - cidrNum)) - 1);
    const subnetMask = [
      (fullMask >> 24) & 255,
      (fullMask >> 16) & 255,
      (fullMask >> 8) & 255,
      fullMask & 255
    ];

    // Calculate network address
    const networkAddress = ipOctets.map((octet, index) => octet & subnetMask[index]);

    // Calculate broadcast address
    const invertedMask = subnetMask.map(octet => 255 - octet);
    const broadcastAddress = networkAddress.map((octet, index) => octet | invertedMask[index]);

    // Calculate first and last usable hosts
    const firstHost = [...networkAddress];
    const lastHost = [...broadcastAddress];
    
    if (usableHosts > 0) {
      firstHost[3] += 1;
      lastHost[3] -= 1;
    }

    setCalculationResult({
      networkAddress: networkAddress.join('.'),
      broadcastAddress: broadcastAddress.join('.'),
      subnetMask: subnetMask.join('.'),
      firstUsableHost: firstHost.join('.'),
      lastUsableHost: lastHost.join('.'),
      totalHosts,
      usableHosts,
      cidr: `/${cidr}`
    });
  };

  const resetCalculator = () => {
    setIpAddress('');
    setCidr('24');
    setCalculationResult(null);
    setError('');
  };

  return (
    <div className="max-w-2xl bg-gradient-to-r from-blue-100 to-teal-100 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Subnet Calculator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IP Address
          </label>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="192.168.1.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CIDR Prefix Length
          </label>
          <input
            type="number"
            value={cidr}
            onChange={(e) => setCidr(e.target.value)}
            min="0"
            max="32"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={calculateSubnet}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Calculate
          </button>
          <button
            onClick={resetCalculator}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {calculationResult && (
          <div className="mt-6 bg-gradient-to-r from-blue-100 to-teal-100 space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <ResultItem 
                label="Network Address"
                value={calculationResult.networkAddress + calculationResult.cidr}
              />
              <ResultItem 
                label="Broadcast Address"
                value={calculationResult.broadcastAddress}
              />
              <ResultItem 
                label="Subnet Mask"
                value={calculationResult.subnetMask}
              />
              <ResultItem 
                label="First Usable Host"
                value={calculationResult.firstUsableHost}
              />
              <ResultItem 
                label="Last Usable Host"
                value={calculationResult.lastUsableHost}
              />
              <ResultItem 
                label="Total Hosts"
                value={calculationResult.totalHosts.toLocaleString()}
              />
              <ResultItem 
                label="Usable Hosts"
                value={calculationResult.usableHosts.toLocaleString()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultItem = ({ label, value }) => (
  <div className="bg-white p-3 rounded-md shadow-sm">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="font-mono text-sm mt-1">{value}</div>
  </div>
);

export default SubnetCalculator;