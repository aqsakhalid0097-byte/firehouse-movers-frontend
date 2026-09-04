import React from 'react';
import {
  Truck,
  ClipboardCheck,
  Building2,
  Shirt,
  Gift,
  FileCheck,
  Package,
  Camera,
  Award,
  Users,
  CalendarCheck,
} from 'lucide-react';
import { AuthServiceCard } from './AuthServiceCard';

export const AuthLandingServicesGrid: React.FC = () => {
  const iconClass = 'w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.25]';

  const coreServices = [
    {
      title: 'Truck Availability & Job Logistics',
      category: 'AVAILABILITY',
      description: 'See real-time availability and dispatch job logistics efficiently.',
      imageSrc: '/images/firehouse_movers.jpeg',
      linkTo: '/vehicle/vehicle-availability/',
      badgeColorClass: 'bg-red-500/20 text-red-400',
      iconSvg: <Truck className={`${iconClass} text-red-400`} />,
    },
    {
      title: 'Truck & Trailer Inspection',
      category: 'INSPECTION',
      description: 'Quick checklists and photo logging for safety compliance.',
      imageSrc: '/images/truck_inspection.jpeg',
      linkTo: '/truck-inspection/',
      badgeColorClass: 'bg-blue-500/20 text-blue-400',
      iconSvg: <ClipboardCheck className={`${iconClass} text-blue-400`} />,
    },
    {
      title: 'Firehouse Station',
      category: 'STATION',
      description: 'Station resources, schedules and hub operations at a glance.',
      imageSrc: '/images/firehouse_station.jpeg',
      linkTo: '/report/1/',
      badgeColorClass: 'bg-emerald-500/20 text-emerald-400',
      iconSvg: <Building2 className={`${iconClass} text-emerald-400`} />,
    },
  ];

  const additionalServices = [
    {
      title: 'Uniform Inventory System',
      category: 'INVENTORY',
      description: 'Manage uniforms, sizes and allocations.',
      imageSrc: '/images/uniform.jpg',
      linkTo: '/inventory/',
      badgeColorClass: 'bg-purple-500/20 text-purple-400',
      iconSvg: <Shirt className={`${iconClass} text-purple-400`} />,
    },
    {
      title: 'Gift Cards',
      category: 'GIFT',
      description: 'Rewards for employees and special promotions.',
      imageSrc: '/images/gift_cards.jpg',
      linkTo: '/awards/gifts/',
      badgeColorClass: 'bg-yellow-500/20 text-yellow-400',
      iconSvg: <Gift className={`${iconClass} text-yellow-400`} />,
    },
    {
      title: 'On Site Inspection',
      category: 'ONSITE',
      description: 'Record site conditions & get approvals quickly.',
      imageSrc: '/images/onsite_inspection.jpg',
      linkTo: '/onsite-inspection/',
      badgeColorClass: 'bg-teal-500/20 text-teal-400',
      iconSvg: <FileCheck className={`${iconClass} text-teal-400`} />,
    },
    {
      title: 'Packaging & Supplies',
      category: 'PACKAGING',
      description: 'High-quality packing for fragile goods.',
      imageSrc: '/images/packaging.jpeg',
      linkTo: '/packaging/',
      badgeColorClass: 'bg-indigo-500/20 text-indigo-400',
      iconSvg: <Package className={`${iconClass} text-indigo-400`} />,
    },
  ];

  const marketingPerformanceServices = [
    {
      title: 'Marketing Inventory',
      category: 'MARKETING',
      description: 'Branded assets & photos.',
      imageSrc: '/images/marketing.jpeg',
      linkTo: '/people',
      badgeColorClass: 'bg-pink-500/20 text-pink-400',
      iconSvg: <Camera className={`${iconClass} text-pink-400`} />,
    },
    {
      title: 'Prizes & Acknowledgements',
      category: 'AWARDS',
      description: 'Recognize and reward top performers.',
      imageSrc: '/images/acknowledgments.jpg',
      linkTo: '/awards',
      badgeColorClass: 'bg-amber-500/20 text-amber-400',
      iconSvg: <Award className={`${iconClass} text-amber-400`} />,
    },
    {
      title: 'Employees Evaluation',
      category: 'EVALUATION',
      description: 'Create and manage evaluation forms.',
      imageSrc: '/images/employees_evaluation.jpg',
      linkTo: '/goals',
      badgeColorClass: 'bg-emerald-500/20 text-emerald-400',
      iconSvg: <Users className={`${iconClass} text-emerald-400`} />,
    },
    {
      title: 'Dispatch Operations',
      category: 'DISPATCH',
      description: 'Handles live moves, driver dispatches, and schedule boards.',
      imageSrc: '/images/IMG_1031.jpg',
      linkTo: '/dispatch/',
      badgeColorClass: 'bg-red-500/20 text-red-400',
      iconSvg: <CalendarCheck className={`${iconClass} text-red-400`} />,
    },
  ];

  return (
    <section id="operations-grid" className="max-w-[1520px] w-full mx-auto px-3 sm:px-5 lg:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Section 1: Core Services (3-column grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coreServices.map((service, index) => (
          <AuthServiceCard key={index} {...service} />
        ))}
      </div>

      {/* Section 2: Inventory & Operations (4-column grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {additionalServices.map((service, index) => (
          <AuthServiceCard key={index} {...service} />
        ))}
      </div>

      {/* Section 3: Performance, Marketing & Bookings (4-column grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketingPerformanceServices.map((service, index) => (
          <AuthServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  );
};

export default AuthLandingServicesGrid;
