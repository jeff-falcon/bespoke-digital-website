<script lang="ts">
	import { getContrastYIQFromColor } from '$lib/color';
	import { bgColor, footerHasContactForm, pageHasHero } from '$lib/store';
	import { onMount } from 'svelte';

	onMount(() => {
		pageHasHero.set(false);
		const defaultBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-light');
		const color = defaultBg;
		bgColor.set(color);
		document.body.style.setProperty('--page-bg-color', color);
		document.body.className = `bg-is-${
			getContrastYIQFromColor($bgColor) === 'white' ? 'dark' : 'light'
		}`;
		document.body.style.backgroundColor = $bgColor;
		footerHasContactForm.set(false);
	});
</script>

<div class="page gutter">
	<div class="wrap">
		<h1>PRIVACY POLICY</h1>
		<p class="updated">Last updated November 19, 2024</p>
		<p>
			This Privacy Notice for Bespoke Digital Inc ("we," "us," or "our"), describes how and why we
			might access, collect, store, use, and/or share ("process") your personal information when you
			use our services ("Services"), including when you:
		</p>
		<ul>
			<li>
				Visit our website at <a href="http://www.bespokedigital.com"
					>http://www.bespokedigital.com</a
				>, or any website of ours that links to this Privacy Notice
			</li>
			<li>Engage with us in other related ways, including any sales, marketing, or events</li>
		</ul>
		<p>
			Questions or concerns? Reading this Privacy Notice will help you understand your privacy
			rights and choices. We are responsible for making decisions about how your personal
			information is processed. If you do not agree with our policies and practices, please do not
			use our Services. If you still have any questions or concerns, please contact us at <a
				href="mailto:info@bespokedigital.com">info@bespokedigital.com</a
			>.
		</p>
		<h2 class="summary">SUMMARY OF KEY POINTS</h2>
		<p>
			<strong
				><em
					>This summary provides key points from our Privacy Notice, but you can find out more
					details about any of these topics by clicking the link following each key point or by
					using our <a href="#toc">table of contents</a> below to find the section you are looking for.</em
				></strong
			>
		</p>
		<p>
			<strong>What personal information do we process?</strong> When you visit, use, or navigate our
			Services, we may process personal information depending on how you interact with us and the
			Services, the choices you make, and the products and features you use.
			<a href="#personalinfo">Learn more about personal information you disclose to us.</a>
		</p>
		<p>
			<strong>Do we process any sensitive personal information?</strong> Some of the information may
			be considered "special" or "sensitive" in certain jurisdictions, for example your racial or ethnic
			origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.
		</p>
		<p>
			<strong>Do we collect any information from third parties?</strong> We do not collect any information
			from third parties.
		</p>
		<p>
			<strong>How do we process your information?</strong> We process your information to provide,
			improve, and administer our Services, communicate with you, for security and fraud prevention,
			and to comply with law. We may also process your information for other purposes with your
			consent. We process your information only when we have a valid legal reason to do so.
			<a href="#infouse">Learn more about how we process your information.</a>
		</p>
		<p>
			<strong>In what situations and with which parties do we share personal information?</strong>
			We may share information in specific situations and with specific third parties.
			<a href="#whoshare">Learn more about when and with whom we share your personal information.</a
			>
		</p>
		<p>
			<strong>How do we keep your information safe?</strong> We have adequate organizational and
			technical processes and procedures in place to protect your personal information. However, no
			electronic transmission over the internet or information storage technology can be guaranteed
			to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other
			unauthorized third parties will not be able to defeat our security and improperly collect,
			access, steal, or modify your information.
			<a href="#infosafe">Learn more about how we keep your information safe.</a>
		</p>
		<p>
			<strong>What are your rights?</strong> Depending on where you are located geographically, the
			applicable privacy law may mean you have certain rights regarding your personal information.
			<a href="#privacyrights">Learn more about your privacy rights.</a>
		</p>
		<p>
			<strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is
			by submitting a
			<a href="https://app.termly.io/notify/26fa51ee-cccb-4158-a7d2-a913cc77b169"
				>data subject access request,</a
			> or by contacting us. We will consider and act upon any request in accordance with applicable
			data protection laws.
		</p>
		<p>
			Want to learn more about what we do with any information we collect? <a href="#toc"
				>Review the Privacy Notice in full.</a
			>
		</p>
		<span id="toc"></span>
		<h2>TABLE OF CONTENTS</h2>
		<p><a href="#infocollect">1. WHAT INFORMATION DO WE COLLECT?</a></p>
		<p><a href="#infouse">2. HOW DO WE PROCESS YOUR INFORMATION?</a></p>
		<p>
			<a href="#legalbases"
				>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</a
			>
		</p>
		<p><a href="#whoshare">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></p>
		<p><a href="#cookies">5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></p>
		<p><a href="#inforetain">6. HOW LONG DO WE KEEP YOUR INFORMATION?</a></p>
		<p><a href="#infosafe">7. HOW DO WE KEEP YOUR INFORMATION SAFE?</a></p>
		<p><a href="#infominors">8. DO WE COLLECT INFORMATION FROM MINORS?</a></p>
		<p><a href="#privacyrights">9. WHAT ARE YOUR PRIVACY RIGHTS?</a></p>
		<p><a href="#DNT">10. CONTROLS FOR DO-NOT-TRACK FEATURES</a></p>
		<p><a href="#uslaws">11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></p>
		<p><a href="#policyupdates">12. DO WE MAKE UPDATES TO THIS NOTICE?</a></p>
		<p>
			<a href="#request">13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a>
		</p>
		<p>
			<a href="#request">14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a>
		</p>
		<span id="infocollect"></span>
		<h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
		<h3>Personal information you disclose to us</h3>
		<p>
			<strong><em>In Short:</em></strong>
			<em>We collect personal information that you provide to us.</em>
		</p>
		<p>
			We collect personal information that you voluntarily provide to us when you express an
			interest in obtaining information about us or our products and Services, when you participate
			in activities on the Services, or otherwise when you contact us.
		</p>
		<p>
			<strong>Personal Information Provided by You.</strong> The personal information that we collect
			depends on the context of your interactions with us and the Services, the choices you make, and
			the products and features you use. The personal information we collect may include the following:
		</p>
		<ul>
			<li>names</li>
			<li>phone numbers</li>
			<li>email addresses</li>
			<li>job titles</li>
			<li>contact preferences</li>
		</ul>
		<p><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
		<p>
			All personal information that you provide to us must be true, complete, and accurate, and you
			must notify us of any changes to such personal information.
		</p>
		<h3>Information automatically collected</h3>
		<p>
			<strong><em>In Short:</em></strong>
			<em
				>Some information — such as your Internet Protocol (IP) address and/or browser and device
				characteristics — is collected automatically when you visit our Services.</em
			>
		</p>
		<p>
			We automatically collect certain information when you visit, use, or navigate the Services.
			This information does not reveal your specific identity (like your name or contact
			information) but may include device and usage information, such as your IP address, browser
			and device characteristics, operating system, language preferences, referring URLs, device
			name, country, location, information about how and when you use our Services, and other
			technical information. This information is primarily needed to maintain the security and
			operation of our Services, and for our internal analytics and reporting purposes.
		</p>
		<p>The information we collect includes:</p>
		<ul>
			<li>
				<em>Log and Usage Data.</em> Log and usage data is service-related, diagnostic, usage, and performance
				information our servers automatically collect when you access or use our Services and which we
				record in log files. Depending on how you interact with us, this log data may include your IP
				address, device information, browser type, and settings and information about your activity in
				the Services (such as the date/time stamps associated with your usage, pages and files viewed,
				searches, and other actions you take such as which features you use), device event information
				(such as system activity, error reports (sometimes called "crash dumps"), and hardware settings).
			</li>
			<li>
				<em>Location Data.</em> We collect location data such as information about your device's location,
				which can be either precise or imprecise. How much information we collect depends on the type
				and settings of the device you use to access the Services. For example, we may use GPS and other
				technologies to collect geolocation data that tells us your current location (based on your IP
				address). You can opt out of allowing us to collect this information either by refusing access
				to the information or by disabling your Location setting on your device. However, if you choose
				to opt out, you may not be able to use certain aspects of the Services.
			</li>
		</ul>
		<span id="infouse"></span>
		<h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em
				>We process your information to provide, improve, and administer our Services, communicate
				with you, for security and fraud prevention, and to comply with law. We may also process
				your information for other purposes with your consent.</em
			>
		</p>
		<p>
			<strong
				>We process your personal information for a variety of reasons, depending on how you
				interact with our Services, including:</strong
			>
		</p>
		<ul>
			<li>
				To save or protect an individual's vital interest. We may process your information when
				necessary to save or protect an individual’s vital interest, such as to prevent harm.
			</li>
		</ul>
		<span id="legalbases"></span>
		<h2>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em
				>We only process your personal information when we believe it is necessary and we have a
				valid legal reason (i.e., legal basis) to do so under applicable law, like with your
				consent, to comply with laws, to provide you with services to enter into or fulfill our
				contractual obligations, to protect your rights, or to fulfill our legitimate business
				interests.</em
			>
		</p>
		<p><strong><u>If you are located in the EU or UK, this section applies to you.</u></strong></p>
		<p>
			The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid
			legal bases we rely on in order to process your personal information. As such, we may rely on
			the following legal bases to process your personal information:
		</p>
		<ul>
			<li>
				<strong>Consent.</strong> We may process your information if you have given us permission
				(i.e., consent) to use your personal information for a specific purpose. You can withdraw
				your consent at any time.
				<a href="#withdrawconsent">Learn more about withdrawing your consent.</a>
			</li>
			<li>
				<strong>Legal Obligations.</strong> We may process your information where we believe it is necessary
				for compliance with our legal obligations, such as to cooperate with a law enforcement body or
				regulatory agency, exercise or defend our legal rights, or disclose your information as evidence
				in litigation in which we are involved.
			</li>
			<li>
				<strong>Vital Interests.</strong> We may process your information where we believe it is necessary
				to protect your vital interests or the vital interests of a third party, such as situations involving
				potential threats to the safety of any person.
			</li>
		</ul>
		<p><strong><u>If you are located in Canada, this section applies to you.</u></strong></p>
		<p>
			We may process your information if you have given us specific permission (i.e., express
			consent) to use your personal information for a specific purpose, or in situations where your
			permission can be inferred (i.e., implied consent). You can <a href="#withdrawconsent"
				>withdraw your consent</a
			> at any time.
		</p>
		<p>
			In some exceptional cases, we may be legally permitted under applicable law to process your
			information without your consent, including, for example:
		</p>
		<ul>
			<li>
				If collection is clearly in the interests of an individual and consent cannot be obtained in
				a timely way
			</li>
			<li>For investigations and fraud detection and prevention</li>
			<li>For business transactions provided certain conditions are met</li>
			<li>
				If it is contained in a witness statement and the collection is necessary to assess,
				process, or settle an insurance claim
			</li>
			<li>For identifying injured, ill, or deceased persons and communicating with next of kin</li>
			<li>
				If we have reasonable grounds to believe an individual has been, is, or may be victim of
				financial abuse
			</li>
			<li>
				If it is reasonable to expect collection and use with consent would compromise the
				availability or the accuracy of the information and the collection is reasonable for
				purposes related to investigating a breach of an agreement or a contravention of the laws of
				Canada or a province
			</li>
			<li>
				If disclosure is required to comply with a subpoena, warrant, court order, or rules of the
				court relating to the production of records
			</li>
			<li>
				If it was produced by an individual in the course of their employment, business, or
				profession and the collection is consistent with the purposes for which the information was
				produced
			</li>
			<li>If the collection is solely for journalistic, artistic, or literary purposes</li>
			<li>If the information is publicly available and is specified by the regulations</li>
		</ul>
		<span id="whoshare"></span>
		<h2>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em
				>We may share information in specific situations described in this section and/or with the
				following third parties.</em
			>
		</p>
		<p>We may need to share your personal information in the following situations:</p>
		<ul>
			<li>
				<strong>Business Transfers.</strong> We may share or transfer your information in connection
				with, or during negotiations of, any merger, sale of company assets, financing, or acquisition
				of all or a portion of our business to another company.
			</li>
		</ul>
		<span id="cookies"></span>
		<h2>5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em
				>We may use cookies and other tracking technologies to collect and store your information.</em
			>
		</p>
		<p>
			We may use cookies and similar tracking technologies (like web beacons and pixels) to gather
			information when you interact with our Services. Some online tracking technologies help us
			maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and
			assist with basic site functions.
		</p>
		<p>
			We also permit third parties and service providers to use online tracking technologies on our
			Services for analytics and advertising, including to help manage and display advertisements,
			to tailor advertisements to your interests, or to send abandoned shopping cart reminders
			(depending on your communication preferences). The third parties and service providers use
			their technology to provide advertising about products and services tailored to your interests
			which may appear either on our Services or on other websites.
		</p>
		<p>
			To the extent these online tracking technologies are deemed to be a "sale"/"sharing" (which
			includes targeted advertising, as defined under the applicable laws) under applicable US state
			laws, you can opt out of these online tracking technologies by submitting a request as
			described below under section "<a href="#uslaws"
				>DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a
			>"
		</p>
		<p>
			Specific information about how we use such technologies and how you can refuse certain cookies
			is set out in our Cookie Notice.
		</p>
		<h3>Google Analytics</h3>
		<p>
			We may share your information with Google Analytics to track and analyze the use of the
			Services. The Google Analytics Advertising Features that we may use include: Google Analytics
			Demographics and Interests Reporting. To opt out of being tracked by Google Analytics across
			the Services, visit <a href="https://tools.google.com/dlpage/gaoptout"
				>https://tools.google.com/dlpage/gaoptout</a
			>. You can opt out of Google Analytics Advertising Features through
			<a href="https://adssettings.google.com/">Ads Settings</a>
			and Ad Settings for mobile apps. Other opt out means include
			<a href="http://optout.networkadvertising.org/">http://optout.networkadvertising.org/</a>
			and
			<a href="http://www.networkadvertising.org/mobile-choice"
				>http://www.networkadvertising.org/mobile-choice</a
			>. For more information on the privacy practices of Google, please visit the
			<a href="https://policies.google.com/privacy">Google Privacy & Terms page</a>.
		</p>
		<span id="inforetain"></span>
		<h2>6. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em
				>We keep your information for as long as necessary to fulfill the purposes outlined in this
				Privacy Notice unless otherwise required by law.</em
			>
		</p>
		<p>
			We will only keep your personal information for as long as it is necessary for the purposes
			set out in this Privacy Notice, unless a longer retention period is required or permitted by
			law (such as tax, accounting, or other legal requirements).
		</p>
		<p>
			When we have no ongoing legitimate business need to process your personal information, we will
			either delete or anonymize such information, or, if this is not possible (for example, because
			your personal information has been stored in backup archives), then we will securely store
			your personal information and isolate it from any further processing until deletion is
			possible.
		</p>
		<span id="infosafe"></span>
		<h2>7. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em
				>We aim to protect your personal information through a system of organizational and
				technical security measures.</em
			>
		</p>
		<p>
			We have implemented appropriate and reasonable technical and organizational security measures
			designed to protect the security of any personal information we process. However, despite our
			safeguards and efforts to secure your information, no electronic transmission over the
			Internet or information storage technology can be guaranteed to be 100% secure, so we cannot
			promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will
			not be able to defeat our security and improperly collect, access, steal, or modify your
			information. Although we will do our best to protect your personal information, transmission
			of personal information to and from our Services is at your own risk. You should only access
			the Services within a secure environment.
		</p>
		<span id="infominors"></span>
		<h2>8. DO WE COLLECT INFORMATION FROM MINORS?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em>We do not knowingly collect data from or market to children under 18 years of age.</em>
		</p>
		<p>
			We do not knowingly collect, solicit data from, or market to children under 18 years of age,
			nor do we knowingly sell such personal information. By using the Services, you represent that
			you are at least 18 or that you are the parent or guardian of such a minor and consent to such
			minor dependent’s use of the Services. If we learn that personal information from users less
			than 18 years of age has been collected, we will deactivate the account and take reasonable
			measures to promptly delete such data from our records. If you become aware of any data we may
			have collected from children under age 18, please contact us at <a
				href="mailto:info@bespokedigital.com">info@bespokedigital.com</a
			>.
		</p>
		<span id="privacyrights"></span>
		<h2>9. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em
				>Depending on your state of residence in the US or in some regions, such as the European
				Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that
				allow you greater access to and control over your personal information. You may review,
				change, or terminate your account at any time, depending on your country, province, or state
				of residence.</em
			>
		</p>
		<p>
			In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under
			applicable data protection laws. These may include the right (i) to request access and obtain
			a copy of your personal information, (ii) to request rectification or erasure; (iii) to
			restrict the processing of your personal information; (iv) if applicable, to data portability;
			and (v) not to be subject to automated decision-making. In certain circumstances, you may also
			have the right to object to the processing of your personal information. You can make such a
			request by contacting us by using the contact details provided in the section "<a
				href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a
			>" below.
		</p>
		<p>
			We will consider and act upon any request in accordance with applicable data protection laws.
			If you are located in the EEA or UK and you believe we are unlawfully processing your personal
			information, you also have the right to complain to your <a
				href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
				>Member State data protection authority</a
			>
			or
			<a
				href="https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/"
				>UK data protection authority</a
			>.
		</p>
		<p>
			If you are located in Switzerland, you may contact the <a
				href="https://www.edoeb.admin.ch/edoeb/en/home.html"
				>Federal Data Protection and Information Commissioner</a
			>.
		</p>
		<span id="withdrawconsent"></span>
		<p>
			<strong><u>Withdrawing your consent:</u></strong> If we are relying on your consent to process
			your personal information, which may be express and/or implied consent depending on the
			applicable law, you have the right to withdraw your consent at any time. You can withdraw your
			consent at any time by contacting us by using the contact details provided in the section "<a
				href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a
			>" below.
		</p>
		<p>
			However, please note that this will not affect the lawfulness of the processing before its
			withdrawal nor, when applicable law allows, will it affect the processing of your personal
			information conducted in reliance on lawful processing grounds other than consent.
		</p>
		<p>
			<strong><u>Opting out of marketing and promotional communications:</u></strong> You can
			unsubscribe from our marketing and promotional communications at any time by clicking on the
			unsubscribe link in the emails that we send, or by contacting us using the details provided in
			the section "<a href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a>" below. You will
			then be removed from the marketing lists. However, we may still communicate with you — for
			example, to send you service-related messages that are necessary for the administration and
			use of your account, to respond to service requests, or for other non-marketing purposes.
		</p>
		<p>
			If you have questions or comments about your privacy rights, you may email us at <a
				href="mailto:info@bespokedigital.com">info@bespokedigital.com</a
			>.
		</p>
		<span id="DNT"></span>
		<h2>10. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
		<p>
			Most web browsers and some mobile operating systems and mobile applications include a
			Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not
			to have data about your online browsing activities monitored and collected. At this stage, no
			uniform technology standard for recognizing and implementing DNT signals has been finalized.
			As such, we do not currently respond to DNT browser signals or any other mechanism that
			automatically communicates your choice not to be tracked online. If a standard for online
			tracking is adopted that we must follow in the future, we will inform you about that practice
			in a revised version of this Privacy Notice.
		</p>
		<p>
			California law requires us to let you know how we respond to web browser DNT signals. Because
			there currently is not an industry or legal standard for recognizing or honoring DNT signals,
			we do not respond to them at this time.
		</p>
		<span id="uslaws"></span>
		<h2>11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em
				>If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana,
				Iowa, Kentucky, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Tennessee,
				Texas, Utah, or Virginia, you may have the right to request access to and receive details
				about the personal information we maintain about you and how we have processed it, correct
				inaccuracies, get a copy of, or delete your personal information. You may also have the
				right to withdraw your consent to our processing of your personal information. These rights
				may be limited in some circumstances by applicable law. More information is provided below.</em
			>
		</p>
		<h3>Categories of Personal Information We Collect</h3>
		<p>
			We have collected the following categories of personal information in the past twelve (12)
			months:
		</p>
		<table width="100%">
			<thead>
				<tr>
					<th>Category</th>
					<th>Examples</th>
					<th>Collected</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>A. Identifiers</td>
					<td
						>Contact details, such as real name, alias, postal address, telephone or mobile contact
						number, unique personal identifier, online identifier, Internet Protocol address, email
						address, and account name</td
					>
					<td>NO</td>
				</tr>
				<tr>
					<td>B. Personal information as defined in the California Customer Records statute</td>
					<td
						>Name, contact information, education, employment, employment history, and financial
						information</td
					>
					<td>NO</td>
				</tr>
				<tr>
					<td>C. Protected classification characteristics under state or federal law</td>
					<td
						>Gender, age, date of birth, race and ethnicity, national origin, marital status, and
						other demographic data</td
					>
					<td>NO</td>
				</tr>
				<tr>
					<td>D. Commercial information</td>
					<td
						>Transaction information, purchase history, financial details, and payment information</td
					>
					<td>NO</td>
				</tr>
				<tr>
					<td>E. Biometric information</td>
					<td>Fingerprints and voiceprints</td>
					<td>NO</td>
				</tr>
				<tr>
					<td>F. Internet or other similar network activity</td>
					<td
						>Browsing history, search history, online behavior, interest data, and interactions with
						our and other websites, applications, systems, and advertisements</td
					>
					<td>NO</td>
				</tr>
				<tr>
					<td>G. Geolocation data</td>
					<td>Device location</td>
					<td>NO</td>
				</tr>
				<tr>
					<td>H. Audio, electronic, sensory, or similar information</td>
					<td
						>Images and audio, video or call recordings created in connection with our business
						activities</td
					>
					<td>NO</td>
				</tr>
				<tr>
					<td>I. Professional or employment-related information</td>
					<td
						>Business contact details in order to provide you our Services at a business level or
						job title, work history, and professional qualifications if you apply for a job with us</td
					>
					<td>NO</td>
				</tr>
				<tr>
					<td>J. Education Information</td>
					<td>Student records and directory information</td>
					<td>NO</td>
				</tr>
				<tr>
					<td>K. Inferences drawn from collected personal information</td>
					<td
						>Inferences drawn from any of the collected personal information listed above to create
						a profile or summary about, for example, an individual’s preferences and characteristics</td
					>
					<td>NO</td>
				</tr>
				<tr>
					<td>L. Sensitive personal Information</td>
					<td></td>
					<td>NO</td>
				</tr>
			</tbody>
		</table>
		<p>
			We may also collect other personal information outside of these categories through instances
			where you interact with us in person, online, or by phone or mail in the context of:
		</p>
		<ul>
			<li>Receiving help through our customer support channels;</li>
			<li>Participation in customer surveys or contests; and</li>
			<li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
		</ul>
		<h3>Sources of Personal Information</h3>
		<p>
			Learn more about the sources of personal information we collect in "<a href="#infocollect"
				>WHAT INFORMATION DO WE COLLECT?</a
			>"
		</p>
		<h3>How We Use and Share Personal Information</h3>
		<p>
			Learn more about how we use your personal information in the section, "<a href="#infouse"
				>HOW DO WE PROCESS YOUR INFORMATION?</a
			>"
		</p>
		<h3>Will your information be shared with anyone else?</h3>
		<p>
			We may disclose your personal information with our service providers pursuant to a written
			contract between us and each service provider. Learn more about how we disclose personal
			information to in the section, "<a href="#whoshare"
				>WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a
			>"
		</p>
		<p>
			We may use your personal information for our own business purposes, such as for undertaking
			internal research for technological development and demonstration. This is not considered to
			be "selling" of your personal information.
		</p>
		<p>
			We have not disclosed, sold, or shared any personal information to third parties for a
			business or commercial purpose in the preceding twelve (12) months. We will not sell or share
			personal information in the future belonging to website visitors, users, and other consumers.
		</p>
		<h3>Your Rights</h3>
		<p>
			You have rights under certain US state data protection laws. However, these rights are not
			absolute, and in certain cases, we may decline your request as permitted by law. These rights
			include:
		</p>
		<ul>
			<li><strong>Right to know</strong> whether or not we are processing your personal data</li>
			<li><strong>Right to access</strong> your personal data</li>
			<li><strong>Right to correct</strong> inaccuracies in your personal data</li>
			<li><strong>Right to request</strong> the deletion of your personal data</li>
			<li>
				<strong>Right to obtain</strong> a copy of the personal data you previously shared with us
			</li>
			<li><strong>Right to non-discrimination</strong> for exercising your rights</li>
			<li>
				<strong>Right to opt out</strong> of the processing of your personal data if it is used for targeted
				advertising (or sharing as defined under California’s privacy law), the sale of personal data,
				or profiling in furtherance of decisions that produce legal or similarly significant effects
				("profiling")
			</li>
		</ul>
		<p>Depending upon the state where you live, you may also have the following rights:</p>
		<ul>
			<li>
				Right to access the categories of personal data being processed (as permitted by applicable
				law, including Minnesota’s privacy law)
			</li>
			<li>
				Right to obtain a list of the categories of third parties to which we have disclosed
				personal data (as permitted by applicable law, including California's and Delaware's privacy
				law)
			</li>
			<li>
				Right to obtain a list of specific third parties to which we have disclosed personal data
				(as permitted by applicable law, including Minnesota's and Oregon's privacy law)
			</li>
			<li>
				Right to review, understand, question, and correct how personal data has been profiled (as
				permitted by applicable law, including Minnesota’s privacy law)
			</li>
			<li>
				Right to limit use and disclosure of sensitive personal data (as permitted by applicable
				law, including California’s privacy law)
			</li>
			<li>
				Right to opt out of the collection of sensitive data and personal data collected through the
				operation of a voice or facial recognition feature (as permitted by applicable law,
				including Florida’s privacy law)
			</li>
		</ul>
		<h3>How to Exercise Your Rights</h3>
		<p>
			To exercise these rights, you can contact us by submitting a <a
				href="https://app.termly.io/notify/26fa51ee-cccb-4158-a7d2-a913cc77b169"
				>data subject access request</a
			>, by emailing us at <a href="mailto:info@bespokedigital.com">info@bespokedigital.com</a>, or
			by referring to the contact details at the bottom of this document.
		</p>
		<p>
			Under certain US state data protection laws, you can designate an authorized agent to make a
			request on your behalf. We may deny a request from an authorized agent that does not submit
			proof that they have been validly authorized to act on your behalf in accordance with
			applicable laws.
		</p>
		<h3>Request Verification</h3>
		<p>
			Upon receiving your request, we will need to verify your identity to determine you are the
			same person about whom we have the information in our system. We will only use personal
			information provided in your request to verify your identity or authority to make the request.
			However, if we cannot verify your identity from the information already maintained by us, we
			may request that you provide additional information for the purposes of verifying your
			identity and for security or fraud-prevention purposes.
		</p>
		<p>
			If you submit the request through an authorized agent, we may need to collect additional
			information to verify your identity before processing your request and the agent will need to
			provide a written and signed permission from you to submit such request on your behalf.
		</p>
		<h3>Appeals</h3>
		<p>
			Under certain US state data protection laws, if we decline to take action regarding your
			request, you may appeal our decision by emailing us at <a
				href="mailto:info@bespokedigital.com">info@bespokedigital.com</a
			>. We will inform you in writing of any action taken or not taken in response to the appeal,
			including a written explanation of the reasons for the decisions. If your appeal is denied,
			you may submit a complaint to your state attorney general.
		</p>
		<h3>California "Shine The Light" Law</h3>
		<p>
			California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our
			users who are California residents to request and obtain from us, once a year and free of
			charge, information about categories of personal information (if any) we disclosed to third
			parties for direct marketing purposes and the names and addresses of all third parties with
			which we shared personal information in the immediately preceding calendar year. If you are a
			California resident and would like to make such a request, please submit your request in
			writing to us by using the contact details provided in the section "<a href="#contact"
				>HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a
			>"
		</p>
		<span id="policyupdates"></span>
		<h2>12. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
		<p>
			<strong><em>In Short:</em></strong>
			<em>Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
		</p>
		<p>
			We may update this Privacy Notice from time to time. The updated version will be indicated by
			an updated "Revised" date at the top of this Privacy Notice. If we make material changes to
			this Privacy Notice, we may notify you either by prominently posting a notice of such changes
			or by directly sending you a notification. We encourage you to review this Privacy Notice
			frequently to be informed of how we are protecting your information.
		</p>
		<span id="contact"></span>
		<h2>13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
		<p>
			If you have questions or comments about this notice, you may email us at <a
				href="mailto:info@bespokedigital.com">info@bespokedigital.com</a
			> or contact us by post at:
		</p>
		<p>
			Bespoke Digital Inc<br />
			100 Crosby Street<br />
			#301<br />
			New York, NY 10012<br />
			United States
		</p>
		<span id="request"></span>
		<h2>14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
		<p>
			Based on the applicable laws of your country or state of residence in the US, you may have the
			right to request access to the personal information we collect from you, details about how we
			have processed it, correct inaccuracies, or delete your personal information. You may also
			have the right to withdraw your consent to our processing of your personal information. These
			rights may be limited in some circumstances by applicable law. To request to review, update,
			or delete your personal information, please fill out and submit a <a
				href="https://app.termly.io/notify/26fa51ee-cccb-4158-a7d2-a913cc77b169"
				>data subject access request</a
			>.
		</p>
	</div>
</div>

<style>
	.page {
		--section-spacing: 3rem;
		padding-top: var(--top-nav-height);
	}
	.updated {
		font-size: 0.85em;
		font-weight: bold;
	}
	.summary {
		margin-top: var(--section-spacing);
	}
	table {
		--border-color: color-mix(in srgb, currentColor, transparent 75%);
		width: 100%;
		border: 1px solid var(--border-color);
		border-right: none;
		border-collapse: collapse;
	}
	td,
	th {
		border-bottom: 1px solid var(--border-color);
		border-right: 1px solid var(--border-color);
		padding: 1rem;
		text-align: left;
	}

	a {
		text-decoration: underline;
	}
	a:hover {
		color: black;
	}

	th {
		background: color-mix(in srgb, currentColor, transparent 90%);
	}
	span[id] {
		display: block;
		position: relative;
		height: var(--top-nav-height);
	}
	@media (max-width: 480px) {
		table {
			font-size: 0.75em;
		}
	}
	@media (min-width: 720px) {
		.page {
			--section-spacing: 4rem;
			display: grid;
			grid-template-columns: repeat(12, 1fr);
		}
		.wrap {
			grid-column: 2 / span 10;
		}
	}
</style>
