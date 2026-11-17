# Puts the real final Vitest run (final-run.txt) into report.md section 6.3. Run from sis-04\.
p = 'report.md'
t = open(p, encoding='utf-8').read()
o = open('final-run.txt', encoding='utf-8', errors='replace').read().rstrip()
if '@@FINALRUN@@' not in t:
    print('marker not found - already filled?')
else:
    open(p, 'w', encoding='utf-8').write(t.replace('@@FINALRUN@@', o))
    print('section 6.3 filled')
