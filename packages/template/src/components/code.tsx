import { Prism, type SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface CodeProps {
  code: string;
  language?: string;
  className?: string;
}

const SyntaxHighlighter = Prism as unknown as React.FC<SyntaxHighlighterProps>;

export function Code({ code, language, className }: CodeProps) {
  return (
    <div className={cn(className, 'overflow-x-auto')}>
      <SyntaxHighlighter
        language={language}
        customStyle={{
          margin: 0,
          overflowX: 'auto',
          overflowY: 'visible',
        }}
        style={oneLight}
        codeTagProps={{ className: 'block text-xs' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
