import { HelpCircle, Mail, MapPin, Phone, Search, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const HelpPage = () => {
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [ticket, setTicket] = useState({ name: '', email: '', message: '' });

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(search.toLowerCase()) || 
    faq.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast(t('supportRequestToast'), 'success');
    setTicket({ name: '', email: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* FAQs */}
        <Card className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">{t('faqCenterLabel')}</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-gray-100">{t('faqPageTitle')}</h2>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              placeholder={t('searchHelpPlaceholder')}
            />
          </label>
          <div className="mt-4 space-y-3">
            {filteredFaqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm">
                <div className="flex items-start gap-2 font-semibold text-slate-900 dark:text-gray-100">
                  <HelpCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <p className="mt-2 text-slate-600 dark:text-gray-400 leading-6 pl-6">{faq.a}</p>
              </div>
            ))}
            {!filteredFaqs.length && (
              <p className="text-center py-8 text-slate-500 dark:text-gray-400">{t('noHelpArticlesFound')}</p>
            )}
          </div>
        </Card>

        {/* Contact Form & Info */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">{t('getHelpLabel')}</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-gray-100">{t('contactSupportTitle')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                {t('yourNameLabel')}
                <input 
                  required
                  value={ticket.name}
                  onChange={(e) => setTicket(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border bg-slate-50 dark:bg-slate-800 px-4 py-3 outline-none focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 transition"
                  placeholder={t('namePlaceholder')}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                {t('emailAddressLabel')}
                <input 
                  required
                  type="email"
                  value={ticket.email}
                  onChange={(e) => setTicket(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border bg-slate-50 dark:bg-slate-800 px-4 py-3 outline-none focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 transition"
                  placeholder={t('emailPlaceholder')}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                {t('detailedMessageLabel')}
                <textarea 
                  required
                  value={ticket.message}
                  onChange={(e) => setTicket(prev => ({ ...prev, message: e.target.value }))}
                  className="mt-2 min-h-24 w-full rounded-2xl border bg-slate-50 dark:bg-slate-800 px-4 py-3 outline-none focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 transition"
                  placeholder={t('messagePlaceholder')}
                />
              </label>
              <Button type="submit" className="w-full flex items-center justify-center gap-2">
                <Send className="h-4 w-4" /> {t('sendRequestButton')}
              </Button>
            </form>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400">
              <Mail className="h-4 w-4 text-emerald-700" />
              <span>support@farmverse.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400">
              <Phone className="h-4 w-4 text-emerald-700" />
              <span>+91 422 243 9000</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 text-emerald-700" />
              <span>AgriTech Techpark, Coimbatore, TN</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
