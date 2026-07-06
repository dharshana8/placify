import React from 'react';
import { Zap } from 'lucide-react';

const ComingSoon = ({ title, description, icon: Icon = Zap }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-500/10 border border-primary-500/20 mb-4">
          <Icon className="w-8 h-8 text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Coming Soon!</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          {description || 'This feature is under development and will be available soon.'}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></div>
          <span className="text-primary-400 text-sm font-medium">In Development</span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
