'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <main className="min-h-screen container max-w-7xl mx-auto bg-background">
      <section className="relative py-24">
        <div className="absolute" />

        <div className="relative px-4">
          {/* عنوان صفحه */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">تماس با ما</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              ما همیشه آماده پاسخگویی به سؤالات و پیشنهادات شما هستیم
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* اطلاعات تماس */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-card/30 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl border">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 lg:mb-8 text-right bg-gradient-to-l from-primary/20 to-transparent p-3 sm:p-4 rounded-lg">
                  راه‌های ارتباطی
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-md border border-primary/10 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-4 sm:p-5 lg:p-6">
                      <div className="mb-4 sm:mb-5 lg:mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                          <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-foreground/90 group-hover:text-primary transition-colors duration-300">
                        ایمیل
                      </h3>
                      <p className="text-base sm:text-lg text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        info@zophira.com
                      </p>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-md border border-primary/10 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-4 sm:p-5 lg:p-6">
                      <div className="mb-4 sm:mb-5 lg:mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                          <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-foreground/90 group-hover:text-primary transition-colors duration-300">
                        تلفن تماس
                      </h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <p className="text-base sm:text-lg text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                          09172024294
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-md border border-primary/10 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-4 sm:p-5 lg:p-6">
                      <div className="mb-4 sm:mb-5 lg:mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                          <Image src="/icons/whatsapp.svg" alt="واتس آپ" width={24} height={24} className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-foreground/90 group-hover:text-primary transition-colors duration-300">
                        واتس آپ
                      </h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <p className="text-base sm:text-lg text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                          09172024294
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* فرم تماس */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-right">
                ارسال پیام
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="نام و نام خانوادگی"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-background/50"
                />

                <Input
                  type="email"
                  placeholder="آدرس ایمیل"
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-background/50"
                  dir="ltr"
                />

                <Input
                  placeholder="موضوع پیام"
                  value={formData.subject}
                  onChange={e =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="bg-background/50"
                />

                <Textarea
                  placeholder="متن پیام"
                  value={formData.message}
                  onChange={e =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="min-h-[150px] bg-background/50"
                />

                <Button type="submit" className="w-full">
                  ارسال پیام
                </Button>
              </form>
            </motion.div>
          </div>

          {/* نقشه */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <div className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-right">
                موقعیت دفتر مرکزی
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.2554256365895!2d51.41043227619063!3d35.759451227270834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0834c8c0c3a3%3A0x7c3c373c8c8c8c8c!2z2KjYsdisINmG2q_bjNmGINmI2YbaqQ!5e0!3m2!1sfa!2s!4v1620000000000!5m2!1sfa!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div> */}
        </div>
      </section>
    </main>
  );
}
