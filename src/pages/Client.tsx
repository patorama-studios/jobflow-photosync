
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { ContentDelivery } from "@/components/client/ContentDelivery";

const Client = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold">Client Portal</h1>
              <p className="text-muted-foreground mt-1">
                View and download your delivered content
              </p>
            </div>
            
            <ContentDelivery />
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Client;
