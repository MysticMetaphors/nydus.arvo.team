import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Area */}
      <div className="flex items-end justify-between border-b border-sky-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-sky-900 uppercase tracking-tight">Dashboard</h1>
          <p className="text-sm text-sky-600 mt-2 font-medium">System Overview & Quick Actions</p>
        </div>
        <Link 
          href="/projects" 
          className="bg-sky-600 text-white px-6 py-3 text-sm font-bold hover:bg-sky-800 transition-colors duration-200 uppercase tracking-wider"
        >
          Create New Webhook
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Active Webhooks', value: '12' },
          { label: 'Recent Deployments', value: '8' },
          { label: 'System Load', value: 'Low' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 border border-sky-200 hover:border-sky-500 transition-colors duration-200 cursor-default shadow-sm">
            <div className="text-xs text-sky-400 uppercase font-bold tracking-widest mb-3">{stat.label}</div>
            <div className="text-4xl font-bold text-sky-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Stub */}
      <div className="bg-white border border-sky-200 shadow-sm">
        <div className="px-6 py-4 border-b border-sky-200 bg-slate-50 text-xs font-bold text-sky-800 uppercase tracking-widest">
          Recent Signals
        </div>
        <div className="divide-y divide-sky-100">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors duration-200">
               <div>
                 <span className="font-mono text-sky-500 text-xs mr-4 bg-sky-100 px-2 py-1">UUID-8X92</span>
                 <span className="text-sky-900 font-bold text-sm">Project Alpha Deployment</span>
               </div>
               <span className="text-xs text-sky-400 font-mono">2m ago</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}