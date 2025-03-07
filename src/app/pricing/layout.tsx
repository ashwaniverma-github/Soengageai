import Navbar from "@/components/Navbar";

export default function PricingLayout({
    children
}:{children:React.ReactNode}
)
{
    return <>
    <Navbar bg="black"/>
    {children}
    </>
}