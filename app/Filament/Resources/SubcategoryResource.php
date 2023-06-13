<?php

namespace App\Filament\Resources;

use Closure;
use Filament\Forms;
use Filament\Tables;
use App\Models\Content;
use App\Models\Subcategory;
use Illuminate\Support\Str;
use Filament\Resources\Form;
use Filament\Resources\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\ImageColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Filament\Resources\SubcategoryResource\Pages;
use App\Filament\Resources\SubcategoryResource\RelationManagers;

class SubcategoryResource extends Resource
{
    protected static ?string $model = Subcategory::class;

    protected static ?string $navigationIcon = 'heroicon-o-document';

    protected static ?string $navigationGroup = 'Production';

    public static ?string $label = 'Subcategories';
    public static ?string $singularLabel = 'Subcategory';

    public static function form(Form $form): Form
    {

        $contentOptions = Content::pluck('title')->toArray();

        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(2048)
                    ->reactive()
                    ->afterStateUpdated(function (Closure $set, $state) {
                        $set('slug', Str::slug($state));
                    }),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(2048),
                Select::make('category')
                    ->options(Content::pluck('category', 'category'))
                    ->required(),
                Textarea::make('description')
                    ->label('Description')
                    ->required(),
                Forms\Components\Toggle::make('active')
                    ->required(),
                // Select::make('Content', 'content_id')
                //     ->options($contentOptions)
                //     ->required(),
                Forms\Components\FileUpload::make('main_image'),
                Forms\Components\FileUpload::make('image2'),
                Forms\Components\FileUpload::make('image3'),
                Forms\Components\FileUpload::make('image4'),
                TextInput::make('price')
                    ->label('Price'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Title')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('category')
                    ->label('Product Category')
                    ->searchable(),
                TextColumn::make('description')
                    ->label('Description')
                    ->searchable(),
                ImageColumn::make('main_image')
                    ->label('Main image'),
                Tables\Columns\IconColumn::make('active')
                    ->sortable()
                    ->boolean(),
                TextColumn::make('price')
                    ->label('Price')
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }


    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubcategories::route('/'),
            'create' => Pages\CreateSubcategory::route('/create'),
            'edit' => Pages\EditSubcategory::route('/{record}/edit'),
        ];
    }
}
