import Image from 'next/image';
import PrivyProviderWrapper from '../components/PrivyProviderWrapper';
import Homepage from './Homepage'
import Header from '../components/Header'
export default function Home() {
  return (
    <div>
    <Header/>
    <Homepage/>
    </div>
  );
}