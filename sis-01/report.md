# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.4

---

## 1. Scenario

**Question:** Discuss at least three ethical issues in software development. Analyze stakeholders, possible harms and safeguards in your scenario.

**Users:** University administration, course instructors, teaching assistants, and undergraduate students.

**Problem:** The university desperately needs a highly accurate system to automatically detect plagiarism in large batches of introductory programming assignments without increasing the grading workload.

**Constraints:** The system must fully process and score all submissions within a strict 5-minute window, and it must not permanently store any student code on external servers due to strict university privacy policies.

**Risk:** High risk of false positives that unjustly accuse innocent students of cheating, potentially ruining their academic records and causing severe emotional distress.

**Assumptions:** The automated system relies entirely on an external, third-party API for code analysis and similarity matching (fictional).

## 2. Analysis

The automated programming plagiarism detector involves several key stakeholders: university administration, who must protect academic integrity; students, whose grades and reputations depend on fair treatment; teaching assistants, who review flagged work; and the developers, who decide how the system is built and which external vendor to use. Three ethical issues stand out in this scenario.

The first issue is the risk of false accusations. Plagiarism detectors typically measure structural or textual similarity, which is not definitive proof of copying. In short first-year tasks, where the problem heavily constrains a program's structure, honest solutions may look identical. An innocent student could easily be flagged, leading to severe harms including stress, an unjust disciplinary process, and loss of trust. Developers carry part of the ethical responsibility here. The ACM/IEEE-CS Software Engineering Code of Ethics states engineers should approve software only with a well-founded belief that it passes appropriate tests. Therefore, the development team must rigorously test the detector on realistic assignments—including honest but similar solutions—before deployment. A key safeguard is to treat the output strictly as a signal, not a verdict. 

The second issue is privacy and the reliance on a third-party API. I assume the university's main Learning Management System (LMS) stores submissions permanently, while this detection system simply hashes and sends the data, deleting its own local copy after returning a score within the 5-minute constraint. However, the API sends student code to an external vendor. While a contract can demand the vendor not retain code, the university cannot easily verify this, meaning the no-storage constraint might not hold in practice. Developers have an ethical duty to audit a vendor's data-handling terms before integration, aligning with the principle that software should not diminish privacy.

The third issue is transparency and accountability. Students and teaching assistants must know what the system compares and what its limitations are. If the vendor's matching method is a black box, the university cannot explain why a student was flagged, crippling the manual appeal process. Developers should prioritize a vendor that transparently documents how flags are generated and provide reviewers with contextual data (like starter code) to prevent automation bias, ensuring the system remains fair and reliable.

## 3. Review

Prompt B's critique highlighted several critical gaps in the initial draft, forcing a deeper evaluation of the constraints. First, it correctly pointed out that my proposed safeguard of temporarily storing matched code violated the strict scenario constraint that student code must not be permanently stored. To fix this, I qualified the system's architecture: I assumed the university's main Learning Management System (LMS) retains the original submissions, while the detection system securely processes and immediately deletes its copy. 

Second, the critique noted I completely neglected the developers' own ethical choices. I verified this gap against the ACM/IEEE-CS Code of Ethics (Principle 1.03), which states engineers must only approve software if it passes appropriate tests and strictly protects privacy (verification row 1, keep decision). Consequently, I updated the analysis to explicitly hold developers accountable for testing accuracy and vetting the third-party vendor's data practices.

Additionally, Prompt B warned that relying solely on 'human review' is dangerous due to automation bias—instructors might blindly trust a high similarity score. I accepted this insight, explicitly updating the text (change-log row 2) to mandate that reviewers receive contextual data, such as starter code and problem constraints. Finally, the AI originally claimed that the 5-minute processing constraint would drastically reduce accuracy by forcing simpler algorithms. I rejected this unsupported speculation (change-log row 1). Relying on an external API shifts the computational load, meaning the 5-minute limit is more of a networking constraint than a hard algorithmic bottleneck. I could not check the Sommerville chapter 1 claim in the book, so I dropped it and checked the JPlag README instead (verification row 2, qualify). All twelve points of the critique are judged in the table in Appendix C. These revisions grounded the final analysis in realistic software engineering ethics rather than generic assumptions.

## 4. Conclusion

I recommend deploying the plagiarism detection system only if the university can secure a strict, auditable data-processing agreement with the third-party API vendor, ensuring absolute zero retention of student code. Furthermore, the system must be configured explicitly as an advisory tool rather than an automated judge. Instructors must be trained to recognize automation bias and manually review all contextual evidence before initiating any disciplinary process.

The main limitation of this recommendation is the inherent opacity of external APIs. Even with a contract, the university cannot directly audit the vendor's external servers to guarantee code is deleted within the 5-minute processing window. This residual privacy risk means the university must accept a degree of trust in the vendor, which could be disastrous if the vendor suffers a data breach.

## 5. Reflection

Working on this assignment with Claude was very interesting experience for me. At first, the AI helped me a lot to generate basic ideas and structure the text quickly, because sometimes it is hard to start writing from zero. It gave me a good foundation about privacy and false positives. But then I saw that the AI is not perfect at all. For example, it totally forgot to include developers in the stakeholders list, even though they are the ones who build the system and make ethical choices. Also, it just invented a rule about 5 minutes making the accuracy worse, which was a speculation without proofs. I realized that I can't just blindly trust what the neural network says. I had to manually check the ACM Code of Ethics to prove the point about developers responsibility. The biggest thing I learned is that AI is a good assistant for brainstorming, but I always have to fact check every claim it makes, otherwise my work will have logical mistakes.

## 6. References

- ACM/IEEE-CS. (1999). Software Engineering Code of Ethics and Professional Practice. URL: https://www.acm.org/code-of-ethics/software-engineering-code (accessed 2026-10-11).
- JPlag. README. URL: https://github.com/jplag/JPlag (accessed 2026-10-11).

## 7. Appendix A — Initial outline

1. Plagiarism detection involves ethical handling of student data.
2. False positives can ruin a student's academic career.
3. Relying on a third-party API raises data privacy concerns.
4. The system must be transparent about how it flags code.
5. There should be a manual appeal process for flagged students.

## 8. Appendix B — AI exchanges

### B1 — Draft (Prompt A)

- **Tool:** Claude
- **Model:** claude-3-5-sonnet
- **Date:** 2026-10-11
- **Purpose:** contextual draft

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.4: Discuss at least three ethical issues in software development. Analyze stakeholders, possible harms and safeguards in your scenario for a first-year-level university assignment.

My scenario is Users: University administration and students. Problem: The university needs a system to automatically detect plagiarism in programming assignments. Constraints: The system must process submissions within 5 minutes, and it must not permanently store student code. Risk: False positives that unjustly accuse innocent students of cheating. My initial ideas are 1. Plagiarism detection involves ethical handling of student data. 2. False positives can ruin a student's academic career. 3. Relying on a third-party API raises data privacy concerns. 4. The system must be transparent about how it flags code. 5. There should be a manual appeal process for flagged students. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**
```text
Draft (about 430 words)
Ethical Issues in an Automated Programming Plagiarism Detector
This system serves two main stakeholders: university administration, who need to protect academic integrity, and students, whose grades and reputations depend on fair treatment. Three ethical issues stand out.
The first issue is false accusations. Plagiarism detectors usually measure similarity between submissions, and similarity is not proof of copying. In first-year programming tasks, many correct solutions look alike because the problem is small and the language has few natural ways to solve it. An innocent student could therefore be flagged. The harm is serious: a wrongful accusation can cause stress, disciplinary records and loss of trust in the university. A safeguard is to treat the system's output as a signal for review, not a verdict. Every flag should be checked by a human instructor, and students should have a clear appeal process.
The second issue is privacy and data handling. Student code is personal academic work. The constraint that the system must not permanently store code protects students, but it creates a trade-off: if code is deleted, the university cannot later show the evidence behind a flag, and students cannot easily challenge it. One compromise is to keep only minimal records, such as similarity scores and the matched code segments for flagged cases, for a limited period, with the policy stated openly. If the system relies on a third-party API, the code leaves university control, so a contract should confirm that the provider does not retain or reuse submissions.
The third issue is transparency and accountability. Students and staff should know what the system compares, what counts as a flag and what its known limits are. A hidden algorithm is hard to question, which makes unfair outcomes harder to detect. The five-minute processing limit adds pressure here, because a faster, simpler method may produce more false positives than a slower, more careful one. The university should accept some extra review time if accuracy suffers otherwise.
In summary, the system benefits administration by saving time and benefits honest students by keeping grading fair, but it puts innocent students at risk if it is trusted too much. Human review, minimal and time-limited data retention, a vetted third-party provider and clear explanations of how flags are produced would reduce these harms while still meeting the stated constraints.
Facts vs. assumptions
Given in your scenario (facts for this assignment):
- Users are administration and students.
- The system must finish within 5 minutes and must not permanently store code.
- False positives are the main risk.
Assumptions I made (state them as assumptions in your write-up):
- The detector works by similarity scoring rather than something else.
- Assignments are small, so many honest solutions look alike.
- A third-party API would receive student code. Your idea 3 implies this, but your scenario doesn't actually say the system uses one.
- A "limited retention period" for flagged cases is acceptable under the no-permanent-storage rule. That depends on how your university defines "permanent."
Trade-offs to discuss
- Privacy vs. evidence: deleting code protects students but weakens appeals.
- Speed vs. accuracy: the 5-minute limit may push toward cheaper, less careful comparisons.
- Automation vs. fairness: more automation saves staff time but raises the risk of unreviewed errors.
- Third-party convenience vs. control: an external API is easier to build but moves student data outside the university.
Claims to verify before submitting
1. That similarity tools commonly produce false positives on short or simple programs. This is plausible, but find a real source from your course materials or library rather than relying on me.
2. Whether your country or university has data protection rules (for example, GDPR if applicable, or local law) that govern sending student work to a third party.
3. Whether your university's academic integrity policy already defines an appeal process you can cite.
4. Whether "damage to academic career" is overstated. Your idea 2 says false positives "can ruin" a career, which is a strong claim. I softened it to "serious harm" in the draft, and you should do the same unless you have evidence.
5. How accuracy and speed actually trade off in real tools. I presented this as a likely risk, not an established fact.
I haven't included any citations, quotations or page numbers. If your assignment requires references, add them from your own sources after verifying the claims above.
I can also trim the draft to exactly 400 words, or restructure it around a stakeholder-harm-safeguard table if your assignment asks for that format.
```

### B2 — Critique (Prompt B)

- **Tool:** Claude
- **Model:** claude-3-5-sonnet
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: Discuss at least three ethical issues in software development. Analyze stakeholders, possible harms and safeguards in your scenario.
Scenario: Users: University administration and students. Problem: The university needs a system to automatically detect plagiarism in programming assignments. Constraints: The system must process submissions within 5 minutes, and it must not permanently store student code. Risk: False positives that unjustly accuse innocent students of cheating. Assumptions: The system uses an external third-party API for code analysis (fictional).
Draft: Ethical Issues in an Automated Programming Plagiarism Detector
This system serves two main stakeholders: university administration, who need to protect academic integrity, and students, whose grades and reputations depend on fair treatment. Three ethical issues stand out.
The first issue is false accusations. Plagiarism detectors usually measure similarity between submissions, and similarity is not proof of copying. In first-year programming tasks, many correct solutions look alike because the problem is small and the language has few natural ways to solve it. An innocent student could therefore be flagged. The harm is serious: a wrongful accusation can cause stress, disciplinary records and loss of trust in the university. A safeguard is to treat the system's output as a signal for review, not a verdict. Every flag should be checked by a human instructor, and students should have a clear appeal process.
The second issue is privacy and data handling. Student code is personal academic work. The constraint that the system must not permanently store code protects students, but it creates a trade-off: if code is deleted, the university cannot later show the evidence behind a flag, and students cannot easily challenge it. One compromise is to keep only minimal records, such as similarity scores and the matched code segments for flagged cases, for a limited period, with the policy stated openly. If the system relies on a third-party API, the code leaves university control, so a contract should confirm that the provider does not retain or reuse submissions.
The third issue is transparency and accountability. Students and staff should know what the system compares, what counts as a flag and what its known limits are. A hidden algorithm is hard to question, which makes unfair outcomes harder to detect. The five-minute processing limit adds pressure here, because a faster, simpler method may produce more false positives than a slower, more careful one. The university should accept some extra review time if accuracy suffers otherwise.
In summary, the system benefits administration by saving time and benefits honest students by keeping grading fair, but it puts innocent students at risk if it is trusted too much. Human review, minimal and time-limited data retention, a vetted third-party provider and clear explanations of how flags are produced would reduce these harms while still meeting the stated constraints.
```

**Response:**

```text
Several of these problems come from my earlier draft, so I've marked those. They're grouped by how much they affect your mark.
Serious problems
1. The retention "compromise" contradicts a stated constraint (my error).
- Issue: The scenario says the system must not permanently store code. The draft proposes keeping matched code segments for flagged cases. Even with a time limit, that stores student code, and "limited period" is my assumption about what "permanently" allows.
- Why it matters: A marker may read this as ignoring a given constraint, and the draft undermines its own privacy argument.
- Alternative interpretation: The constraint may apply only to the detection system, while the university's learning platform already stores submissions. Then no extra storage is needed: the original submission stays there, and the system keeps only a score or fingerprint.
- How to check: Reread the constraint wording, and ask your instructor or state the interpretation explicitly as an assumption.
2. The external API's role in the constraint isn't analyzed.
- Issue: The draft says "if the system relies on a third-party API," but your scenario now states that it does. Also, a contract "confirming" non-retention doesn't show the constraint is met, since the university can't directly verify what a vendor does.
- Why it matters: If the vendor keeps code, the university's no-storage guarantee is false in practice.
- Counterexample: A vendor may keep data in logs or backups despite a contract, or process it in another country.
- How to check: Treat "the vendor's retention practices" as an unknown, and look at what your course materials say about third-party risk and data transfer rules.
3. The draft frames this as an issue of using the system, but the question asks about software development.
- Issue: Missing are the developers' own ethical choices: testing accuracy before launch, documenting limitations, choosing the vendor, and not overstating what the tool can do.
- Why it matters: The question's wording is a likely marking criterion.
- How to check: Look up a professional code of ethics for software engineers (the ACM Code is one real example) and confirm any principle you use from the source itself, rather than from my memory.
Missing reasoning
4. The stakeholder analysis is too narrow.
- Issue: Only administration and students appear. Instructors or teaching assistants who review flags, the vendor, and students whose code is matched against (the source of copying) are all affected.
- Alternative interpretation: "Students" aren't one group. The accused, the accuser's cohort and honest students who gain from detection have different interests.
- How to check: List everyone who sees, supplies, decides on or is affected by a flag, and ask what each stands to gain or lose.
5. "Human review" is presented as a complete safeguard.
- Issue: Reviewers may defer to a high similarity score (automation bias), so a human check can simply confirm the system's error.
- Counterexample: If the reviewer sees only "92% similar," they will likely agree. If they see the matched segments, the instructor's starter code and a note that this task allows few solutions, they can judge properly.
- How to check: Ask what information the reviewer receives, and whether anyone has defined a review threshold.
6. The appeal process conflicts with the no-storage constraint.
- Issue: The draft notes this tension for privacy but doesn't resolve it for appeals. If nothing is kept, what evidence does a student see?
- Why it matters: An appeal without access to the evidence is not fair, so your main safeguard may not work.
- How to check: Work out what the minimum evidence for an appeal would be and whether it can exist under the constraint.
7. False negatives and legitimate collaboration are ignored.
- Issue: The draft only considers wrongly accused students. A tool may also miss real cheating (for example AI-generated code or heavy rewriting), which harms honest students, and may flag permitted collaboration.
- Alternative interpretation: The tool might be too lenient rather than too harsh, and the fairness harm would then run in the other direction.
- How to check: Look at what existing tools claim to detect (for example, documentation for tools such as MOSS or JPlag) and ask what your assignment policy allows.
Vague or unsupported claims
8. "Many correct solutions look alike" and "usually measure similarity."
- Why it matters: These are plausible but unsourced. Because the scenario's system is fictional, its mechanism is also an assumption.
- Counterexample: Some tools compare code structure rather than text, so they may ignore renamed variables but still flag common patterns. Instructor-supplied starter code can also inflate similarity.
- How to check: Find a source in your course reading or library, or label it as an assumption.
9. The speed claim and the paragraph it sits in (my weakest link).
- Issue: "A faster, simpler method may produce more false positives" is asserted without support, and it's attached to the transparency issue with no clear connection. Telling the university to "accept extra review time" also goes against the given 5-minute constraint.
- Alternative interpretation: The limit may be easy to meet if the vendor's service is fast, and it's unclear whether it applies per submission or per batch.
- How to check: State what you assume the 5 minutes covers, and discuss accuracy as a trade-off within the limit.
10. Overstated or unexplained outcomes.
- Issue: "Disciplinary records," "loss of trust," "saving time" and "keeping grading fair" are assumed consequences. "A vetted provider" doesn't say who vets it or how.
- How to check: Confirm what your university's policy says about records, and say what vetting would involve (for example, a security and data protection review).
Structure
11. The assumptions aren't marked. Your task separates facts from assumptions, but the draft blends them. Label what comes from the scenario (the constraints, the external API) and what you inferred.
12. "Student code is personal academic work" is vague. It could mean privacy, ownership or reputation, and each leads to a different harm and safeguard. Pick one and say so.
```

### B3 — Revision (Prompt C)

- **Tool:** Claude
- **Model:** claude-3-5-sonnet
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence
**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions:
- I accept point 3: We must discuss developers' ethical choices (e.g., testing accuracy and choosing vendors) to fit the SE topic.
- I accept point 4: The stakeholder list needs to be expanded to include teaching assistants and the external vendor.
- I qualify point 5: Human review is not a perfect safeguard due to automation bias; reviewers need context (starter code, match limits) to judge fairly.
- I reject point 9: The speed claim (faster method = more false positives) was unsupported speculation, so remove it entirely. Focus on the API integration instead.
- For point 1, we clarify the assumption: The main university LMS stores the code permanently, while our specific detection system deletes its copy after returning the similarity score.

Verified evidence:
1. Regarding point 3 (SE ethics): The ACM/IEEE-CS Software Engineering Code of Ethics, Principle 1.03, states software engineers shall "Approve software only if they have a well-founded belief that it is safe, meets specifications, passes appropriate tests, and does not diminish quality of life, diminish privacy or harm the environment." (Source: ACM/IEEE-CS Software Engineering Code of Ethics, Section 1).
2. Regarding point 8 (False positives in similarity): Ian Sommerville's "Software Engineering" (10th ed., Ch. 1) emphasizes that professional software is not just the programs themselves but also all associated documentation and configuration data. Similarly, detection tools analyze structure and syntax, which can lead to high similarity in short assignments where structure is heavily constrained by the problem.

Draft: Ethical Issues in an Automated Programming Plagiarism Detector
This system serves two main stakeholders: university administration, who need to protect academic integrity, and students, whose grades and reputations depend on fair treatment. Three ethical issues stand out.
The first issue is false accusations. Plagiarism detectors usually measure similarity between submissions, and similarity is not proof of copying. In first-year programming tasks, many correct solutions look alike because the problem is small and the language has few natural ways to solve it. An innocent student could therefore be flagged. The harm is serious: a wrongful accusation can cause stress, disciplinary records and loss of trust in the university. A safeguard is to treat the system's output as a signal for review, not a verdict. Every flag should be checked by a human instructor, and students should have a clear appeal process.
The second issue is privacy and data handling. Student code is personal academic work. The constraint that the system must not permanently store code protects students, but it creates a trade-off: if code is deleted, the university cannot later show the evidence behind a flag, and students cannot easily challenge it. One compromise is to keep only minimal records, such as similarity scores and the matched code segments for flagged cases, for a limited period, with the policy stated openly. If the system relies on a third-party API, the code leaves university control, so a contract should confirm that the provider does not retain or reuse submissions.
The third issue is transparency and accountability. Students and staff should know what the system compares, what counts as a flag and what its known limits are. A hidden algorithm is hard to question, which makes unfair outcomes harder to detect. The five-minute processing limit adds pressure here, because a faster, simpler method may produce more false positives than a slower, more careful one. The university should accept some extra review time if accuracy suffers otherwise.
In summary, the system benefits administration by saving time and benefits honest students by keeping grading fair, but it puts innocent students at risk if it is trusted too much. Human review, minimal and time-limited data retention, a vetted third-party provider and clear explanations of how flags are produced would reduce these harms while still meeting the stated constraints.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
Revised draft (about 450 words)
Ethical Issues in an Automated Programming Plagiarism Detector
This system affects several stakeholders: university administration, who must protect academic integrity; students, whose grades and reputations depend on fair treatment; teaching assistants, who may review flagged work; the external vendor, whose API analyzes the code; and the developers, who decide how the system is built and which vendor to use. Three ethical issues stand out.
The first issue is false accusations. Plagiarism detectors typically measure similarity, and similarity is not proof of copying. In short first-year tasks, where the problem heavily constrains a program's structure, honest solutions may look very alike, so an innocent student could be flagged. Possible harms include stress, a disciplinary process and loss of trust in the university. Developers carry part of the responsibility. The ACM/IEEE-CS Software Engineering Code of Ethics (Principle 1.03) says engineers should approve software only with a well-founded belief that it "passes appropriate tests," so the team should test the detector on realistic assignments, including honest but similar solutions, before it is used. A key safeguard is to treat the output as a signal, not a verdict, with every flag reviewed by an instructor or teaching assistant. Human review is imperfect, however: reviewers may defer to a high score (automation bias). They therefore need context, such as the instructor's starter code, the original submissions and a clear statement of what a score cannot show. Students also need an appeal process.
The second issue is privacy and the third-party API. I assume the university's learning management system (LMS) already stores submissions permanently, while the detection system deletes its own copy after returning a similarity score. This avoids creating an extra store of student code and still leaves the originals available for review and appeals. However, the API sends student code to an external vendor outside university control. A contract can require the vendor not to retain or reuse code, but the university cannot easily verify this, so the no-storage constraint may not hold in practice. Developers therefore have a duty to check a vendor's retention and data-handling terms before choosing it, which fits the Code's concern that software should not "diminish privacy." The trade-off is that an external API likely saves development effort but reduces control over student data.
The third issue is transparency and accountability. Students and staff should know what the system compares, what counts as a flag and what its known limits are. If the vendor's method is not explained, the university may be unable to tell a student why their work was flagged, which weakens both review and appeal. Developers should prefer a vendor that documents how flags are produced, and should show reviewers as much explanation as the API allows.
In summary, the system helps administration protect integrity and honest students receive fair grading, but it puts innocent students at risk if its output is over-trusted. Developer testing, informed human review, careful vendor selection, minimal data copies and clear explanations would reduce these harms.
What I changed and why
- Point 4, stakeholders: Added teaching assistants and the vendor. I also named developers as actors, since your point 3 makes their choices part of the analysis. TA review is stated as "may review" because your scenario doesn't say who reviews.
- Point 3, developer choices: Added testing before deployment and vendor selection. I used one short quote from your supplied Principle 1.03 text and paraphrased the rest.
- Point 1, retention: Removed the proposal to keep matched code segments, since it contradicted the no-storage constraint. The paragraph now uses your LMS assumption, which also resolves the appeal-evidence problem from my earlier point 6: originals stay in the LMS, so reviewers can compare them.
- Point 5, human review: Added the automation bias qualification and the context reviewers need.
- Point 9, speed claim: Removed it, along with the "accept extra review time" sentence, and shifted that space to the vendor and API.
- Light hedging: I changed "disciplinary records" to "a disciplinary process" and added "typically," "may" and "likely." These weren't in your decisions, but they follow your instruction to preserve uncertainty.
Remaining gaps to flag
1. Sommerville doesn't support your false-positive claim. Your note says the book emphasizes that professional software includes documentation and configuration data. That is about what software comprises, not about similarity. The second sentence of that note (tools analyze structure and syntax) has no source attached. I didn't cite Sommerville, and I kept the false-positive reasoning as an unsourced, hedged assumption. If you want a citable source, you need one that actually discusses similarity detection.
2. Check the ACM/IEEE quote yourself. I used your supplied wording and can't verify it independently. Confirm the exact text and principle number against the source. Applying it to vendor choice and privacy is my interpretation, so phrase it as such.
3. The LMS assumption must be stated as an assumption. Your scenario doesn't say the LMS exists or that "must not permanently store" applies only to the detector. Also unresolved: how the system compares a new submission against earlier ones if it keeps no copies.
4. Unknown API behavior. I don't know whether the API returns only a score or also the matched segments. That decides how explainable flags are and what context reviewers get. The draft hedges with "as much explanation as the API allows."
5. The 5-minute constraint is no longer discussed. If your assignment expects every constraint addressed, add one neutral sentence, such as whether the vendor's response time is known.
6. Points you didn't decide on: false negatives and legitimate collaboration (7), unexplained outcomes such as "vetted provider" (10) and the "personal academic work" wording (12). I dropped the phrase from privacy, but the draft still doesn't discuss false negatives or permitted collaboration.
```

## 9. Appendix C — Evidence tables

### Verification table


| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| "Missing are the developers' own ethical choices: testing accuracy before launch..." | ACM/IEEE-CS Software Engineering Code of Ethics, Principle 1.03, https://www.acm.org/code-of-ethics/software-engineering-code (accessed 2026-10-11) | Software engineers must approve software only if it passes appropriate tests and does not diminish privacy. | keep |
| "Plagiarism detectors usually measure similarity between submissions, and similarity is not proof of copying." | JPlag README, opening description, https://github.com/jplag/JPlag (accessed 2026-10-11) | The README describes JPlag as finding "pairwise similarities among a set of multiple programs", so such tools do measure similarity. It does not say that similarity is not proof of copying or that short tasks give false positives, so that part stays my assumption. | qualify |

### Change log


| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| "A faster, simpler method may produce more false positives... The university should accept some extra review time..." | (Removed completely from the final text) | The speed vs accuracy claim was unsupported speculation and violated the strict 5-minute constraint. |
| "Every flag should be checked by a human instructor..." | "Human review is imperfect, however: reviewers may defer to a high score (automation bias)." | Prompt B highlighted that humans blindly trusting the system nullifies the safeguard; they need context. |

### Critique decisions (Prompt B, all 12 points)

| # | Prompt B point | Decision | Reason |
| --- | --- | --- | --- |
| 1 | Retention compromise contradicts the no-storage constraint | qualify | Correct, so I removed it; I assume the LMS keeps originals and say this is an assumption |
| 2 | External API role not analysed | keep | A contract cannot prove deletion; this became the main limitation in the Conclusion |
| 3 | Developers' own ethical choices missing | keep | Checked in ACM/IEEE-CS Principle 1.03 (verification row 1) and added to the analysis |
| 4 | Stakeholders too narrow | keep | Added teaching assistants, the vendor and the developers |
| 5 | Human review is not a complete safeguard | qualify | Review still needed, but reviewers must get starter code and context against automation bias |
| 6 | Appeals conflict with no-storage | keep | Resolved by the LMS assumption: originals stay available for appeals |
| 7 | False negatives and collaboration ignored | reject | Real issue, but the question and word limit focus on harm to innocent students; noted as a limit |
| 8 | "Usually measure similarity" is unsourced | qualify | JPlag README supports similarity measuring; "short tasks give false positives" stays my assumption (verification row 2) |
| 9 | Speed claim unsupported | reject | I challenged it: the 5-minute limit depends on the vendor API and network, not proven to lower accuracy; removed |
| 10 | Outcomes and "vetted provider" unexplained | qualify | Softened "disciplinary records" to "disciplinary process"; vetting stays a vendor terms check |
| 11 | Assumptions not marked | keep | Marked the LMS and API assumptions as assumptions |
| 12 | "Personal academic work" vague | keep | Dropped the phrase from the privacy section |
