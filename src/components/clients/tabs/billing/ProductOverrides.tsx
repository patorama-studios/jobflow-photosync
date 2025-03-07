
import React from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductOverride {
  id: string;
  name: string;
  standardPrice: number;
  overridePrice: number;
  discount: string;
}

interface ProductOverridesProps {
  productOverrides: ProductOverride[];
}

export function ProductOverrides({ productOverrides }: ProductOverridesProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Product Overrides</CardTitle>
        <CardDescription>
          Custom pricing and product configurations for this client.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Standard Price</TableHead>
                <TableHead className="text-right">Custom Price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productOverrides.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${product.standardPrice}</TableCell>
                  <TableCell className="text-right">${product.overridePrice}</TableCell>
                  <TableCell className="text-right text-green-600">{product.discount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product Override
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
