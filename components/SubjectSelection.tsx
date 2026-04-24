import React from 'react';
import { ClassLevel, Subject, Stream } from '../types';
import { getSubjectsList } from '../constants';
import { Calculator, FlaskConical, Languages, Globe2, BookMarked, History, Binary, TrendingUp, Briefcase, Landmark, Palette, Feather, Home, HeartPulse, Activity, Cpu } from 'lucide-react';

import { Board } from '../types';

interface Props {
  classLevel: ClassLevel;
  stream: Stream | null;
  board?: Board;
  onSelect: (subject: Subject) => void;
  onBack: () => void;
  hideBack?: boolean; // New prop to hide back button when used in Dashboard
  initialParentSubject?: string | null;
}

const SubjectIcon: React.FC<{ icon: string, className?: string }> = ({ icon, className }) => {
    switch(icon) {
        case 'math': return <Calculator className={className} />;
        case 'science': 
        case 'physics': return <FlaskConical className={className} />;
        case 'flask': return <FlaskConical className={className} />; 
        case 'bio': return <HeartPulse className={className} />;
        case 'english': 
        case 'hindi':
        case 'sanskrit':
        case 'book':
            return <Languages className={className} />;
        case 'social': return <Globe2 className={className} />;
        case 'geo': return <Globe2 className={className} />;
        case 'computer': return <Cpu className={className} />;
        case 'history': return <History className={className} />;
        case 'accounts': return <TrendingUp className={className} />;
        case 'business': return <Briefcase className={className} />;
        case 'gov': return <Landmark className={className} />;
        case 'ppl': return <BookMarked className={className} />;
        case 'mind': return <Feather className={className} />;
        case 'home': return <Home className={className} />;
        case 'active': return <Activity className={className} />;
        default: return <BookMarked className={className} />;
    }
}

export const SubjectSelection: React.FC<Props> = ({ classLevel, stream, board, onSelect, onBack, hideBack = false, initialParentSubject = null }) => {
  const [selectedParentSubject, setSelectedParentSubject] = React.useState<string | null>(initialParentSubject);

  React.useEffect(() => {
      if (initialParentSubject) {
          setSelectedParentSubject(initialParentSubject);
      }
  }, [initialParentSubject]);

  const rawSubjects = getSubjectsList(classLevel, stream, board);

  const isClass9to12 = ['9', '10', '11', '12'].includes(classLevel);
  const isClass6to8 = ['6', '7', '8'].includes(classLevel);

  // Create a display list of subjects based on grouping
  // By default, just use the raw list, unless we need to show groups.
  // The raw list already contains Physics, Chemistry, Biology, History, Geo etc. if we updated constants.ts
  // Wait, if constants.ts already returns Physics, Chemistry, Biology instead of Science for 9/10,
  // we just need to group them under "Science" and "Social Science" visually here.

  let displaySubjects: Subject[] = [];
  let subSubjects: Subject[] = [];

  const scienceGroup = ['Physics', 'Chemistry', 'Biology'];
  const sstGroup9to12 = ['History', 'Geography', 'Political Science', 'Economics'];
  const sstGroup6to8 = ['History', 'Geography', 'Political Science'];

  if (selectedParentSubject === 'Science') {
      subSubjects = rawSubjects.filter(s => scienceGroup.includes(s.name));
  } else if (selectedParentSubject === 'Social Science') {
      subSubjects = rawSubjects.filter(s => isClass9to12 ? sstGroup9to12.includes(s.name) : sstGroup6to8.includes(s.name));
  } else {
      // Build parent level view
      rawSubjects.forEach(s => {
          if (scienceGroup.includes(s.name) && isClass9to12) {
              if (!displaySubjects.find(ds => ds.name === 'Science')) {
                  displaySubjects.push({ id: 'science', name: 'Science', icon: 'science', color: 'bg-blue-50 text-blue-600' });
              }
          } else if ((sstGroup9to12.includes(s.name) && isClass9to12) || (sstGroup6to8.includes(s.name) && isClass6to8)) {
              if (!displaySubjects.find(ds => ds.name === 'Social Science')) {
                  displaySubjects.push({ id: 'sst', name: 'Social Science', icon: 'geo', color: 'bg-orange-50 text-orange-600' });
              }
          } else {
              displaySubjects.push(s);
          }
      });
  }

  const handleSelect = (subject: Subject) => {
      if (subject.name === 'Science' && isClass9to12) {
          setSelectedParentSubject('Science');
      } else if (subject.name === 'Social Science') {
          setSelectedParentSubject('Social Science');
      } else {
          onSelect(subject);
      }
  };

  const handleBack = () => {
      if (selectedParentSubject) {
          setSelectedParentSubject(null);
      } else {
          onBack();
      }
  };

  const activeList = selectedParentSubject ? subSubjects : displaySubjects;

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 mt-0 pt-0">
      {(!hideBack || selectedParentSubject) && (
        <div className="flex items-center mb-6">
            <button onClick={handleBack} className="text-slate-600 hover:text-slate-800 transition-colors mr-4">
            &larr; Back
            </button>
            <div>
            <h2 className="text-2xl font-bold text-slate-800">
                {selectedParentSubject ? selectedParentSubject : stream ? `${stream} Subjects` : `Class ${classLevel} Subjects`}
            </h2>
            <p className="text-slate-600 text-sm">Select a {selectedParentSubject ? 'sub-subject' : 'subject'} to view chapters</p>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeList.map((subject) => (
          <button
            key={subject.id}
            onClick={() => handleSelect(subject)}
            className="flex items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left group"
          >
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center mr-4 ${subject.color} group-hover:scale-110 transition-transform`}>
              <SubjectIcon icon={subject.icon} className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">{subject.name}</h3>
              <p className="text-xs text-slate-500">{selectedParentSubject || subject.name === 'Science' || subject.name === 'Social Science' ? 'Explore Sections' : 'Explore Syllabus'}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};