// JP Reiss Environmental Group — Site Interactions & Form Handoff

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Modal handling (Prepaid Consultation, Policy, Past Client Consulting)
  const modalBackdrop = document.getElementById('siteModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  const modalContentMap = {
    consult: {
      title: 'Prepaid 1-Hour Consultation ($395)',
      html: `
        <p style="margin-bottom:0.85rem;color:#4A5A63;">One-on-one consultation with Joseph P. Reiss, Jr. (CIEC, CMI) to review existing reports, moisture concerns, or remediation plans.</p>
        <div style="background:#F2EFE9;padding:1rem;border-radius:8px;margin-bottom:1rem;font-size:0.9rem;">
          <strong>Scheduling &amp; Payment Rules:</strong>
          <ul style="margin:0.5rem 0 0 1.2rem;line-height:1.6;">
            <li><strong>Rate:</strong> $395 / hour (payment required prior to scheduling).</li>
            <li><strong>Accepted Methods:</strong> Zelle, Venmo, or check only.</li>
            <li><strong>Availability:</strong> Weekdays, 9:00 AM – 10:00 AM EST (subject to availability).</li>
          </ul>
        </div>
        <p style="font-size:0.88rem;color:#4A5A63;margin-bottom:1.15rem;">Complete the request below and Allison (Scheduling &amp; Activity Coordinator) will send payment instructions and confirm your 9:00 AM weekday slot.</p>
        <button type="button" class="btn btn-primary" style="width:100%;" onclick="prefillAndScroll('One-Hour Prepaid Consultation ($395)')">Request Consultation &amp; Payment Link</button>
      `
    },
    policy: {
      title: 'Sampling & Payment Policy',
      html: `
        <p style="margin-bottom:0.85rem;color:#4A5A63;">All environmental sampling is optional and determined on-site based on building science findings and your health or property goals.</p>
        <ul style="margin:0 0 1rem 1.2rem;color:#18262E;font-size:0.92rem;line-height:1.65;">
          <li><strong>Informed Consent:</strong> Sampling proceeds only with your explicit approval of sample types, locations, and laboratory fees.</li>
          <li><strong>Laboratory Processing:</strong> Samples are dispatched to accredited laboratories upon receipt of payment and written testing confirmation.</li>
          <li><strong>Full Assessment Scope:</strong> Includes the on-site assessment, a 30-minute results call (when lab testing is performed), a written report, and a 30-minute report review call.</li>
          <li><strong>Accepted Payment Methods:</strong> Zelle, Venmo, and checks only.</li>
        </ul>
        <p style="font-size:0.84rem;color:#6C7C85;">A PDF copy of this policy is also provided by email prior to your scheduled appointment.</p>
      `
    },
    retainer: {
      title: 'Ongoing Consulting (Past Clients & Projects)',
      html: `
        <p style="margin-bottom:0.85rem;color:#4A5A63;">Following completion of a Full Assessment—or for ongoing construction, remediation oversight, and project advisory—clients may engage Joe on a <strong>retainer</strong> or <strong>hourly</strong> basis.</p>
        <div style="display:grid;gap:0.75rem;margin-bottom:1.15rem;">
          <div style="border:1px solid #E2DDD5;padding:0.9rem;border-radius:8px;">
            <strong>Hourly Consulting</strong>
            <p style="font-size:0.86rem;color:#4A5A63;margin-top:0.2rem;">Ideal for targeted follow-up calls, remediation protocol reviews, or post-remediation clearance guidance.</p>
          </div>
          <div style="border:1px solid #E2DDD5;padding:0.9rem;border-radius:8px;">
            <strong>Project Retainer</strong>
            <p style="font-size:0.86rem;color:#4A5A63;margin-top:0.2rem;">Dedicated priority access for multi-phase builds, complex biotoxin recovery projects, or commercial advisory.</p>
          </div>
        </div>
        <button type="button" class="btn btn-primary" style="width:100%;" onclick="prefillAndScroll('Consulting on a project')">Select Consulting Option in Form</button>
      `
    }
  };

  window.openModal = (key) => {
    const entry = modalContentMap[key];
    if (!entry || !modalBackdrop) return;
    modalTitle.textContent = entry.title;
    modalBody.innerHTML = entry.html;
    modalBackdrop.classList.add('open');
  };

  window.closeModal = () => {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  };

  if (modalClose) modalClose.addEventListener('click', window.closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) window.closeModal();
    });
  }

  window.prefillAndScroll = (serviceOption) => {
    window.closeModal();
    const select = document.getElementById('helpWith');
    if (select) {
      for (const opt of select.options) {
        if (opt.value === serviceOption || opt.text === serviceOption) {
          select.value = opt.value;
          break;
        }
      }
    }
    const target = document.getElementById('request-assessment');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  // Assessment Request Form Submission (Structured payload ready for monday.com webhook/integration)
  const form = document.getElementById('assessmentForm');
  const feedback = document.getElementById('formFeedback');
  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.submitted_at = new Date().toISOString();
      payload.crm_target = 'monday.com';

      console.info('Assessment Request Payload (monday.com handoff ready):', payload);

      feedback.style.display = 'block';
      feedback.innerHTML = `
        <strong>Thank you, ${escapeHtml(payload.firstName)}. Your request has been recorded.</strong><br>
        Allison (Scheduling &amp; Activity Coordinator) will review your details for <strong>${escapeHtml(payload.city)}, ${escapeHtml(payload.state)}</strong> and follow up via email with next steps, available morning call windows (9:00, 9:30, 10:00, or 10:30 AM), and our Sampling &amp; Payment Policy.
      `;
      form.reset();
    });
  }
});

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
