import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  NetworkIcon, Plus, Minus, RefreshCw, Info, Search, 
  Activity, Settings, AlertCircle, Database 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// Simulated WebSocket for real-time data
const mockWebSocket = {
  onmessage: null,
  send: () => {},
  close: () => {},
};

const EnhancedSubnetMapper = () => {
  const [networkData, setNetworkData] = useState({
    mainNetwork: '192.168.0.0/16',
    subnets: [
      {
        id: 1,
        name: 'Development',
        range: '192.168.1.0/24',
        devices: 45,
        status: 'active',
        services: ['Web Servers', 'Git'],
        bandwidth: '450 Mbps',
        lastUpdated: new Date().toISOString(),
        securityLevel: 'high',
        trafficData: [],
        activeUsers: 23,
        incidentCount: 0,
        vulnerabilities: [],
      },
      {
        id: 2,
        name: 'Testing',
        range: '192.168.1.1/24',
        devices: 30,
        status: 'active',
        services: ['Web Servers', 'Database'],
        bandwidth: '300 Mbps',
        lastUpdated: new Date().toISOString(),
        securityLevel: 'medium',
        trafficData: [],
        activeUsers: 15,
        incidentCount: 1,
        vulnerabilities: ['SQL Injection'],
        },
        {
            id: 3,
            name: 'Production',
            range: '192.168.1.2/24',
            devices: 60,
            status: 'active',
            services: ['Web Servers', 'DNS'],
            bandwidth: '600 Mbps',
            lastUpdated: new Date().toISOString(),
            securityLevel: 'high',
            trafficData: [],
            activeUsers: 35,
            incidentCount: 2,
            vulnerabilities: ['Cross-Site Scripting'],
        },
      // ... (similar data for other subnets)
    ],
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedSubnet, setSelectedSubnet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    securityLevel: 'all',
  });
  const [trafficHistory, setTrafficHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Real-time data simulation
  useEffect(() => {
    const ws = mockWebSocket;
    
    const simulateTraffic = () => {
      setNetworkData(prev => ({
        ...prev,
        subnets: prev.subnets.map(subnet => ({
          ...subnet,
          devices: subnet.devices + Math.floor(Math.random() * 3) - 1,
          trafficData: [...subnet.trafficData, {
            time: new Date().toISOString(),
            value: Math.random() * 100
          }].slice(-20),
        }))
      }));
    };

    const interval = setInterval(simulateTraffic, 5000);
    return () => clearInterval(interval);
  }, []);

  // Search and filter functionality
const filteredSubnets = networkData.subnets.filter(subnet => {
    const matchesSearch = subnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subnet.range.includes(searchTerm);
    const matchesStatus = filters.status === 'all' || subnet.status === filters.status;
    const matchesSecurity = filters.securityLevel === 'all' || 
                           subnet.securityLevel === filters.securityLevel;
    return matchesSearch && matchesStatus && matchesSecurity;
  });

  // Drag and drop handling
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(networkData.subnets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNetworkData(prev => ({
      ...prev,
      subnets: items
    }));
  };

  const NetworkTrafficChart = ({ data }) => (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const SearchAndFilters = () => (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search networks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-2 border rounded-md"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="p-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={filters.securityLevel}
          onChange={(e) => setFilters(prev => ({ ...prev, securityLevel: e.target.value }))}
          className="p-2 border rounded-md"
        >
          <option value="all">All Security Levels</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );

  const SubnetCard = ({ subnet, index }) => (
    <Draggable draggableId={subnet.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="transform transition-all duration-300"
        >
          <div className="p-4 rounded-lg shadow-lg bg-gradient-to-br from-white to-gray-50">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{subnet.name}</h3>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  subnet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subnet.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm space-y-1">
                <p className="font-mono text-gray-600">{subnet.range}</p>
                <p>Devices: {subnet.devices}</p>
                <p>Bandwidth: {subnet.bandwidth}</p>
              </div>

              <NetworkTrafficChart data={subnet.trafficData} />

              <div className="flex flex-wrap gap-2">
                {subnet.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Activity className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                  <span className="text-xs">{subnet.activeUsers} users</span>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <AlertCircle className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                  <span className="text-xs">{subnet.incidentCount} alerts</span>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Settings className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                  <span className="text-xs">Settings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  const DetailedSubnetInfo = ({ subnet }) => (
    <div className="mt-6 p-6 rounded-lg bg-white shadow-lg">
      <h3 className="text-xl font-bold mb-4">Detailed Network Information</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold">Network Details</h4>
          <div className="space-y-2">
            <DetailItem icon={<Database className="w-4 h-4" />} label="IP Range" value={subnet.range} />
            <DetailItem icon={<Activity className="w-4 h-4" />} label="Bandwidth" value={subnet.bandwidth} />
            <DetailItem icon={<AlertCircle className="w-4 h-4" />} label="Security Level" value={subnet.securityLevel} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Performance Metrics</h4>
          <div className="space-y-2">
            <DetailItem icon={<Activity className="w-4 h-4" />} label="Active Users" value={subnet.activeUsers} />
            <DetailItem icon={<AlertCircle className="w-4 h-4" />} label="Incidents" value={subnet.incidentCount} />
            <DetailItem icon={<Info className="w-4 h-4" />} label="Last Updated" value={new Date(subnet.lastUpdated).toLocaleString()} />
          </div>
        </div>
      </div>
    </div>
  );

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-r from-blue-100 to-teal-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <NetworkIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Network Topology</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.5))}
                  className="p-2 rounded hover:bg-gray-100">
            <Minus className="w-5 h-5" />
          </button>
          <button onClick={() => setZoomLevel(z => Math.min(z + 0.1, 1.5))}
                  className="p-2 rounded hover:bg-gray-100">
            <Plus className="w-5 h-5" />
          </button>
          <button onClick={() => window.location.reload()}
                  className="p-2 rounded hover:bg-gray-100">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <SearchAndFilters />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="subnets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSubnets.map((subnet, index) => (
                <SubnetCard
                  key={subnet.id}
                  subnet={subnet}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedSubnet && <DetailedSubnetInfo subnet={selectedSubnet} />}
    </div>
  );
};

export default EnhancedSubnetMapper;