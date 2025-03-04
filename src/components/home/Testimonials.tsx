
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "This platform completely transformed our real estate photography workflow. We've increased efficiency by 40% since implementing it.",
    author: "Sarah Johnson",
    role: "Director, Skyline Photography",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    quote: "The client portal makes content delivery so easy. Our clients love being able to access their photos in such a beautiful interface.",
    author: "Michael Chen",
    role: "Owner, Vision Real Estate Photography",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    quote: "The scheduling system is a game-changer. Being able to calculate drive times has made our booking process so much more efficient.",
    author: "Emma Rodriguez",
    role: "Operations Manager, Premier Property Media",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-semibold mb-4">Trusted by Professionals</h2>
          <p className="text-lg text-muted-foreground">
            Hear what real estate photography businesses have to say about our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg p-8 relative"
            >
              <Quote className="absolute text-primary/10 h-20 w-20 -top-4 -left-4 rotate-180" />
              <div className="relative">
                <p className="text-foreground/80 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary/20"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
