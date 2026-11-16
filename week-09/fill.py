import sys
p='lab-report.md'
t=open(p,encoding='utf-8').read()
o=open('checker-out.txt',encoding='utf-8',errors='replace').read().rstrip()
open(p,'w',encoding='utf-8').write(t.replace('@@CHECKER@@',o))
print('section 8 filled' if '@@CHECKER@@' in t else 'marker not found')
