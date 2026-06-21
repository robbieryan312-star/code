'use client';

import { ConsistencyData } from '@/lib/types';
import { CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const statusConfig = {
  Kept: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', label: 'Promise Kept' },
  Broken: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', label: 'Promise Broken' },
  Compromised: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Compromised' },
  'In Progress': { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', label: 'In Progress' },
  Stalled: { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30', label: 'Stalled' },
};

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#4ade80' : score >= 50 ? '#facc15' : '#f87171';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e3a5f" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text
        x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="middle"
        className="rotate-90" style={{ transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
        fill={color} fontSize={size > 60 ? 18 : 14} fontWeight="bold"
      >
        {score}
      </text>
    </svg>
  );
}

export default function ConsistencyScore({ data, name }: { data: ConsistencyData; name: string }) {
  const chartData = data.termConsistency.map((t) => ({ year: t.year, score: t.score }));

  return (
    <div className="space-y-6">
      {/* Overview Scores */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] text-center">
          <ScoreRing score={data.overallScore} size={72} />
          <div className="text-xs text-gray-400 mt-2">Consistency Score</div>
          <div className="text-xs text-white font-medium">Overall</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] text-center">
          <div className="text-3xl font-bold text-blue-400">{data.partyLineVotePercentage}%</div>
          <div className="text-xs text-gray-400 mt-1">Party-Line</div>
          <div className="text-xs text-white font-medium">Vote Rate</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] text-center">
          <div className={`text-3xl font-bold ${data.lobbyistAlignmentPercentage > 50 ? 'text-red-400' : 'text-green-400'}`}>
            {data.lobbyistAlignmentPercentage}%
          </div>
          <div className="text-xs text-gray-400 mt-1">Lobbyist</div>
          <div className="text-xs text-white font-medium">Alignment</div>
        </div>
      </div>

      {/* Trend Chart */}
      {chartData.length > 0 && (
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f]">
          <h3 className="text-white font-semibold mb-3 text-sm">Consistency Over Time</h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#c8a951' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="score" stroke="#c8a951" strokeWidth={2} dot={{ fill: '#c8a951', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Campaign Promises */}
      <div>
        <h3 className="text-white font-semibold mb-3">Campaign Promise Tracker</h3>
        <div className="space-y-3">
          {data.campaignPromises.map((promise) => {
            const config = statusConfig[promise.status];
            const Icon = config.icon;
            return (
              <div key={promise.id} className={`rounded-xl p-4 border ${config.bg}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 ${config.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium text-sm">{promise.issue}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-[#1e3a5f] rounded-full">{promise.category}</span>
                    </div>
                    <p className="text-gray-300 text-xs mt-1">&ldquo;{promise.statement}&rdquo;</p>
                    {promise.evidence && (
                      <p className="text-gray-400 text-xs mt-1.5">
                        <span className="text-gray-500">Evidence: </span>{promise.evidence}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f]">
        <h3 className="text-white font-semibold mb-2 text-sm">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(
            data.campaignPromises.reduce((acc, p) => {
              acc[p.status] = (acc[p.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([status, count]) => {
            const config = statusConfig[status as keyof typeof statusConfig];
            if (!config) return null;
            return (
              <div key={status} className="text-center">
                <div className={`text-2xl font-bold ${config.color}`}>{count}</div>
                <div className="text-xs text-gray-400">{status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
