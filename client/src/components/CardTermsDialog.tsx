import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from '@/lib/i18n';

interface CardTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CardTermsDialog({ open, onOpenChange }: CardTermsDialogProps) {
  const t = useTranslations();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl max-h-[90vh] p-3 sm:p-6 box-border overflow-y-auto overflow-x-hidden" data-testid="modal-card-terms">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t.cardTermsContent.title}</DialogTitle>
          <DialogDescription>
            {t.cardTermsContent.lastUpdated}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section1.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.cardTermsContent.section1.content}
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section2.title}</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section2.subtitle1}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.cardTermsContent.section2.content1}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section2.subtitle2}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>{t.cardTermsContent.section2.item1}</li>
                    <li>{t.cardTermsContent.section2.item2}</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section3.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">{t.cardTermsContent.section3.content}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                {t.cardTermsContent.section3.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section4.title}</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section4.subtitle1}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.cardTermsContent.section4.content1}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section4.subtitle2}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    {t.cardTermsContent.section4.list1.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section4.subtitle3}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    {t.cardTermsContent.section4.list2.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section5.title}</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section5.subtitle1}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    {t.cardTermsContent.section5.list1.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section5.subtitle2}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.cardTermsContent.section5.content2}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section5.subtitle3}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.cardTermsContent.section5.content3}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section6.title}</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground leading-relaxed">
                  {t.cardTermsContent.section6.content}
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  {t.cardTermsContent.section6.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  {t.cardTermsContent.section6.content2}
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section7.title}</h3>
              <div className="space-y-2">
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  {t.cardTermsContent.section7.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section8.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.cardTermsContent.section8.content}
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section9.title}</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section9.subtitle1}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.cardTermsContent.section9.content1}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section9.subtitle2}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.cardTermsContent.section9.content2}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t.cardTermsContent.section9.subtitle3}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.cardTermsContent.section9.content3}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section10.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                {t.cardTermsContent.section10.content}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                {t.cardTermsContent.section10.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                {t.cardTermsContent.section10.content2}
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section11.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.cardTermsContent.section11.content}
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section12.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.cardTermsContent.section12.content}
              </p>
              <ul className="list-none text-muted-foreground space-y-1 ml-2 mt-2">
                {t.cardTermsContent.section12.list.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                {t.cardTermsContent.section12.content2}
              </p>
            </section>

            <Separator />

            <section>
              <h3 className="font-semibold text-lg mb-3">{t.cardTermsContent.section13.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.cardTermsContent.section13.content}
              </p>
            </section>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Note importante :</strong> {t.cardTermsContent.note}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}